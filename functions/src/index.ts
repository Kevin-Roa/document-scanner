import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as vision from '@google-cloud/vision';
// import { google } from 'googleapis';
// import axios from 'axios';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

admin.initializeApp(functions.config().firebase);

// Listen for object changes on default storage bucket
// export const saveToDrive = functions.storage
// 	.object()
// 	.onFinalize((object: ObjectMetadata) => {
// 		const bucket = admin.storage().bucket(object.bucket);
// 		const fullFileName = object.name;
// 		// const fileName = fullFileName?.split('.pdf')[0];
// 		// const filePath = `gs://${bucket}/${fullFileName}`;
// 		const file = bucket.file(fullFileName!);

// 		// Only run code when a pdf is added to the bucket
// 		if (fullFileName?.includes('.pdf')) {
// 			// Get the file data
// 			file.get().then((data) => {
// 				// Upload to google drive
// 				console.log(data[0]);
// 			});

// 			// Remove pdf from cloud bucket
// 			return file.delete();
// 		} else {
// 			console.log('Uploaded file is not a PDF.');
// 			return null;
// 		}
// 	});

// export const savePdfToDrive = functions.https.onRequest((req, res) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// 	);
// 	if (req.method === 'OPTIONS') {
// 		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
// 		res.status(200).json({});
// 	} else {
// 		console.log('0');

// 		// axios
// 		// 	.post(
// 		// 		'https://oauth2.googleapis.com/token',
// 		// 		{
// 		// 			client_id: creds.web.client_id,
// 		// 			client_secret: creds.web.client_secret,
// 		// 			refresh_token: req.body.token,
// 		// 			grant_type: 'refresh_token'
// 		// 		},
// 		// 		{
// 		// 			headers: {
// 		// 				'Content-Type': 'application/x-www-form-urlencoded'
// 		// 			}
// 		// 		}
// 		// 	)
// 		// 	.then((res) => {
// 		// 		console.log(res);
// 		// 	});

// 		const access_token = '';

// 		axios.get(
// 			`https://www.googleapis.com/drive/v3/files?access_token=${access_token}`
// 		);

// 		// const drive = google.drive({ version: 'v3' });
// 		// console.log('1');
// 		// drive.files.list(
// 		// 	{
// 		// 		pageSize: 10,
// 		// 		fields: 'nextPageToken, files(id, name)'
// 		// 	},
// 		// 	(err, res) => {
// 		// 		if (err) return console.log('The API returned an error: ' + err);
// 		// 		const files = res!.data.files;
// 		// 		if (files!.length) {
// 		// 			console.log('Files:');
// 		// 			files!.map((file) => {
// 		// 				console.log(`${file.name} (${file.id})`);
// 		// 			});
// 		// 		} else {
// 		// 			console.log('No files found.');
// 		// 		}
// 		// 	}
// 		// );
// 	}
// 	res.status(200).json({
// 		data: req.body
// 	});
// });

exports.scanDocument = functions.storage
	.object()
	.onFinalize(async (object: ObjectMetadata) => {
		const bucketName = object.bucket;
		const fileName = object.name;

		const bucket = admin.storage().bucket(bucketName);
		const file = bucket.file(fileName!);
		const [fileMetadata] = await file.getMetadata();
		const owner = fileMetadata.metadata.owner;

		const fileUri = `gs://${bucketName}/${fileName}`;
		const fileDestUri = `gs://${bucketName}/documents/${owner}`;

		console.log(fileName);

		// Only run when the file is a pdf and not in the documents folder
		if (fileName?.includes('documents/')) {
			return;
		} else if (fileName?.includes('.pdf')) {
			await ocr(file, fileUri, fileDestUri);

			// Delete old file once everything is done
			console.log('Deleting file.');
			file.delete();
		}
	});

// Get a string of text from the given pdf file
// Call the callback with the text
async function ocr(file: any, fileUri: String, fileDestUri: String) {
	console.log('Running Vision OCR on "' + fileUri + '".');

	const client = new vision.ImageAnnotatorClient();

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

	const [operation] = await client.asyncBatchAnnotateFiles(request);
	const [filesResponse] = await operation.promise();
	console.log(
		'Saved Vision OCR result to: "' +
			filesResponse.responses![0].outputConfig?.gcsDestination?.uri +
			'".'
	);
}
