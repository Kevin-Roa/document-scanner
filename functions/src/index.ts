import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as vision from '@google-cloud/vision';
// import { google } from 'googleapis';
// import axios from 'axios';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

admin.initializeApp(functions.config().firebase);

exports.scanDocument = functions.storage
	.object()
	.onFinalize(async (object: ObjectMetadata) => {
		const bucketName = object.bucket;
		const bucketRef = admin.storage().bucket(bucketName);

		const fileName = object.name;
		const fileUri = `gs://${bucketName}/${fileName}`;
		const fileDestUri = `gs://${bucketName}/${fileName?.split('.')[0]}`;

		// Case for the OCR output file
		// Run if name has 'output' and has the .json ending
		if (['output', '.json'].every((val) => fileName?.includes(val))) {
			console.log('Getting file metadata.');

			const file = bucketRef.file(fileName!);

			let description = '';

			// Download the json file contents into local memory
			await file.download().then((data) => {
				// Read the data from memory and convert it into a json string
				const dataStr = data[0].toString();

				// Take the json string and form an actual json object
				// Get the responses array from the object
				const responses = JSON.parse(dataStr).responses;

				// Loop through each response, adding the data to a string
				for (let page = 0; page < responses.length; page++) {
					description += responses[page].fullTextAnnotation.text + ' ';
				}

				description.toLowerCase();
				description.replace('\n', ' ');
			});

			let tags: String[] = [];
			const keywords = ['reciept', 'company A', 'company B', 'caliber', 'localhost'];
			keywords.forEach((keyword) => {
				if (description.includes(keyword)) tags.push(keyword);
			});

			console.log(tags);

			// Get the full name of the associated pdf file (with uid path)
			const pdfName = fileName!.split('output')[0] + '.pdf';
			// Get the uid associated with the files
			const uid = pdfName.split('/')[0];
			// Strip the uid path and .pdf
			const pdfTitle = pdfName.split('/')[1].split('.pdf')[0];

			const firestoreRef = admin.firestore().collection('users');

			const data = {
				path: fileUri,
				description: description.split(' '),
				tags
			};

			firestoreRef
				.doc(uid)
				.collection('documents')
				.doc(pdfTitle)
				.set(data);

			const metadata = {
				description,
				tags
			};

			// Set the pdf metadata
			await bucketRef.file(pdfName!).setMetadata({
				metadata
			});
			console.log('Set file metadata.');

			// Delete .json file once metadata is added to the pdf
			file.delete();
		}
		// Case for the uploaded pdf file
		// Run if uploaded to a folder and has the .pdf ending
		else if (['/', '.pdf'].every((val) => fileName?.includes(val))) {
			await ocr(fileUri, fileDestUri);
		}
		// Invalid file
		// Uploaded to main directory
		// Not named properly
		// Not a .pdf or .json
		else console.log('Invalid upload.');
	});

// Get a string of text from the given pdf file
// Call the callback with the text
async function ocr(fileUri: String, fileDestUri: String) {
	console.log('Running Vision OCR on "' + fileUri + '"');

	const client = new vision.ImageAnnotatorClient();

	// Setup for Vision API call
	const inputConfig = {
		mimeType: 'application/pdf',
		gcsSource: {
			uri: fileUri
		}
	};
	const outputConfig = {
		gcsDestination: {
			uri: fileDestUri
		}
	};
	const features = [{ type: 'DOCUMENT_TEXT_DETECTION' }];
	const request = {
		requests: [
			{
				inputConfig,
				outputConfig,
				features
			}
		]
	} as vision.protos.google.cloud.vision.v1.IAsyncBatchAnnotateFilesRequest;

	// Call Vision API
	const [operation] = await client.asyncBatchAnnotateFiles(request);

	// Wait for OCR to complete then log the destination
	// Vision asyncBatchAnnotateFiles can only output to a
	//	cloud storage location
	const [filesResponse] = await operation.promise();
	console.log(
		'Saved Vision OCR result to: "' +
			filesResponse.responses![0].outputConfig?.gcsDestination?.uri +
			'"'
	);
}
