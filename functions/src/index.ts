import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as vision from '@google-cloud/vision';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

admin.initializeApp(functions.config().firebase);

exports.scanDocument = functions.storage
	.object()
	.onFinalize(async (object: ObjectMetadata) => {
		// Name of the bucket the file is in
		const bucketName = object.bucket;
		// Name of the file with directory path and file type
		const fileName = object.name!;

		// Case for the OCR output file
		// Run if name has 'output' and has the .json ending
		if (['output', '.json'].every((val) => fileName?.includes(val))) {
			// Reference to the bucket
			const bucketRef = admin.storage().bucket(bucketName);
			// Reference to the file in storage
			const file = bucketRef.file(fileName);

			await setMetadata(file, fileName);
		}
		// Case for the uploaded pdf file
		// Run if uploaded to a folder and has the .pdf ending
		else if (['/', '.pdf'].every((val) => fileName.includes(val))) {
			// Uri to the file on google cloud
			const fileUri = `gs://${bucketName}/${fileName}`;
			// Uri to the destination for the final file
			const fileDestUri = `gs://${bucketName}/${fileName.split('.')[0]}`;

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

// Read the output file from Vision OCR
// Create new document in firestore with scanned data
async function setMetadata(file: any, fileName: string) {
	console.log('Getting file metadata.');

	// Reference to the users collection
	const firestoreRef = admin.firestore().collection('users');

	// Full name of the associated pdf file (with uid path)
	const pdfFullName = fileName!.split('output')[0] + '.pdf';
	// Strip the uid path
	const pdfName = pdfFullName.split('/')[1];
	// Strip .pdf
	const pdfTitle = pdfName.split('.pdf')[0];
	// Get the uid
	const uid = pdfFullName.split('/')[0];

	let description = '';
	// Download the json file contents into local memory
	await file.download().then((data: any) => {
		// Read the data from memory and convert it into a json string
		const dataStr = data[0].toString();

		// Take the json string and form an actual json object
		// Get the responses array from the object
		const responses = JSON.parse(dataStr).responses;

		// Loop through each response, adding the data to a string
		for (let page = 0; page < responses.length; page++) {
			description += responses[page].fullTextAnnotation.text + ' ';
		}

		// Make all data lowercase and replace new lines with spaces
		description.toLowerCase();
		description.replace('\n', ' ');
	});

	// Get the user defined tags from firestore
	let keywords: string[] = [];
	let userDoc = await firestoreRef.doc(uid).get();
	if (userDoc.exists) keywords = userDoc.data()!.tags;
	else console.log('No user tags are defined.');

	// Find which tags are in the pdf
	let tags: string[] = [];
	keywords.forEach((keyword) => {
		if (description.includes(keyword)) tags.push(keyword);
	});

	// Data to be placed in firestore
	// Description is made into an array
	const data = {
		description: description.split(' '),
		tags
	};

	// Store the pdf information in firestore
	firestoreRef
		.doc(uid)
		.collection('documents')
		.doc(pdfTitle)
		.set(data);

	console.log('Saved file metadata to firestore.');

	// Delete .json file once metadata is added to the pdf
	file.delete();
}
