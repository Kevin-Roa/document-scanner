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
	.onFinalize((object: ObjectMetadata) => {
		const visionClient = new vision.ImageAnnotatorClient();
		const pdf = new jsPDF({ format: [280, 216], unit: 'mm', compress: true });
		const zip = new JSZip();
		const gcs = new Storage();

		const bucket = gcs.bucket(object.bucket);
		const filePath = object.name;
		const fileName = filePath?.split('.zip')[0];
		const pdfName = fileName + '.pdf';
		// const pdfPath = `gs://${scansBucket}/${pdfName}`;
		//const theFile = `gs://${visionBucket}/${filePath}`;

		const workingDir = join(tmpdir(), 'extract');
		const tmpZipPath = join(workingDir, filePath!);
		const tmpPdfPath = join(workingDir, pdfName);

		// Download the zip file to a temp directory
		fs.ensureDir(workingDir)
			.then(() => {
				console.log('1');

				bucket
					.file(filePath!)
					.download({
						destination: tmpZipPath
					})
					.then(() => {
						// Array to hold all scanned words from images
						let results: string[] = [];
						console.log('3');
						// Read the zip file from the temp directory
						// const data = fs.readFileSync(tmpZipPath);

						// Get all the images from the zip file
						fs.readFile(tmpZipPath, (err: Error, data: ArrayBuffer) => {
							if (err) {
								console.log('5' + err);
							} else {
								zip
									.loadAsync(data)
									.then((content: any) => {
										console.log('loaded zip file');

										Object.keys(content.files).forEach((filename, i) => {
											console.log('6');
											content.files[filename]
												.async('base64')
												.then((fileData: any) => {
													console.log('7');
													visionClient
														.documentTextDetection(fileData)
														.then((result: any) => {
															// Take the results and remove punctuation and make every word lowercase
															// Add every word from the result to the results array
															results.concat(
																result.fullTextAnnotation.text
																	.split(' ')
																	.map((data: string) => {
																		data.replace(
																			/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
																			''
																		);
																		data.toLowerCase();
																	})
															);
														});
													console.log('8');
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

													pdf.addPage();
												});
										});
										// pdf.deletePage(pdf.getNumberOfPages());
										// const len = files.length - 1;
										// for (let i = 0; i <= len; i++) {
										// 	const path = tmpZipPath + '' + i;
										// 	console.log('in for loop path is ' + path);

										// 	fs.writeFileSync(path, content.files[files[len - i]]);
										// 	console.log('wrote file');

										// 	const data = fs.readFileSync(path);
										// 	console.log('read file: ' + data);

										// 	const zipfile = content.file(path)!;
										// 	console.log('passed the zip');
										// 	console.log('zipfilename is ' + zipfile.name);

										// 	zipfile.async('base64').then((fileData: any) => {
										// 		console.log(fileData);
										// 		console.log(content.files[files[len - i]]);

										// Use Vision to scan the document

										// }
										console.log('9');
										fs.writeFile(tmpPdfPath, pdf.output());
										console.log('10');
									})
									.then(() => {
										console.log('4');
										// Upload pdf to cloud bucket
										gcs.bucket(scansBucket).upload(tmpPdfPath, {
											destination: pdfName
										});
										console.log('5');
										console.log('end');

										// Remove duplicates from results array
										results = [...new Set(results)];

										// Add the pdf to firestore
										admin
											.firestore()
											.collection('scans')
											.doc(fileName!)
											.set({
												pdf: `gs://${scansBucket}/${pdfName}`,
												date: new Date().getTime(),
												metadata: results,
												tags: []
											});
									})
									.catch((err: Error) => {
										console.log('2' + err);
									});
							}
						});
					})
					.catch((err: Error) => {
						console.log('3' + err);
					});
				fs.unlinkSync(tmpZipPath);
			})
			.catch((err: Error) => {
				console.log('4' + err);
			});
	});
