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
		const fileName = object.name;

		// const bucket = admin.storage().bucket(bucketName);
		// const file = bucket.file(fileName!);

		const fileUri = `gs://${bucketName}/${fileName}`;
		const fileDestUri = `gs://${bucketName}/${fileName?.split('.')[0]}`;

		// Case for the OCR output file
		// Run if name has 'output' and has the .json ending
		if (['output', '.json'].every((val) => fileName?.includes(val))) {
			// Delete old file once metadata is added to the pdf
			// console.log('Deleting file.');
			// file.delete();
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
	console.log('Running Vision OCR on "' + fileUri + '".');

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
			'".'
	);
}
