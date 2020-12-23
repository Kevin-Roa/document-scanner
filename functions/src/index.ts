import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as vision from '@google-cloud/vision';
import { Storage } from '@google-cloud/storage';
import { jsPDF } from 'jspdf';
import * as JSZip from 'jszip';
// @ts-ignore
import { getBinaryContent } from 'jszip-utils';
// @ts-ignore
import * as fs from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

admin.initializeApp(functions.config().firebase);

const visionBucket = 'document-scanner-ab480-vision';
const scansBucket = 'document-scanner-ab480-scans';

export const pdfScanner = functions.storage
	.bucket(visionBucket)
	.object()
	.onFinalize(async (object: ObjectMetadata) => {
		const visionClient = new vision.ImageAnnotatorClient();
		const pdf = new jsPDF({ format: [280, 216], unit: 'mm', compress: true });
		const zip = new JSZip();
		const gcs = new Storage();

		const bucket = gcs.bucket(object.bucket);
		const filePath = object.name;
		const fileName = filePath?.split('.zip')[0];
		const pdfName = fileName + '.pdf';

		const workingDir = join(tmpdir(), 'extract');
		const tmpZipPath = join(workingDir, filePath!);

		// Download the zip file to a temp directory
		await fs.ensureDir(workingDir);
		await bucket.file(filePath!).download({
			destination: tmpZipPath
		});

		// Array to hold all scanned words from images
		let results: string[] = [];

		// Read the zip file from the temp directory
		await getBinaryContent(tmpZipPath, (err: Error, data: string) => {
			if (err) {
				console.log(err);
			} else {
				// Get all the images from the zip file
				zip.loadAsync(data).then(async function(content: any) {
					const files = Object.keys(content.files);
					const len = files.length - 1;
					for (let i = 0; i <= len; i++) {
						await content.files[files[len - i]]
							.async('base64')
							.then(function(fileData: any) {
								// Use Vision to scan the document
								visionClient
									.documentTextDetection(fileData)
									.then((result: any) => {
										// Take the results and remove punctuation and make every word lowercase
										// Add every word from the result to the results array
										results.concat(
											result.fullTextAnnotation.text
												.split(' ')
												.map((data: string) => {
													data.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
													data.toLowerCase();
												})
										);
									});

								// Append image to the pdf file
								pdf.addImage(
									'data:image/png;base64,' + fileData,
									'PNG',
									0,
									-216,
									280,
									216,
									'' + i,
									'NONE',
									270
								);
								if (i < len) {
									pdf.addPage();
								}
							});
					}
				});

				// Upload pdf to cloud bucket
				gcs.bucket(scansBucket).upload(pdfName, {
					destination: join(scansBucket, pdfName)
				});
			}
		});

		// Remove duplicates from results array
		results = [...new Set(results)];

		// Add the pdf to firestore
		admin
			.firestore()
			.collection('scans')
			.doc(fileName!)
			.set({
				pdf: `gs://${scansBucket}/${filePath}`,
				date: new Date(),
				metadata: results,
				tags: []
			});
	});
