import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import { google } from 'googleapis';
import axios from 'axios';
// import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

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
const creds = {
	web: {
		client_id:
			'89321499014-u75galc6n9uiu8h8bo0cb9h89d7ae9kh.apps.googleusercontent.com',
		project_id: 'document-scanner-ab480',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_secret: 'yCOYu9jkvm7XkIYObboM4yn4',
		redirect_uris: [
			'https://document-scanner-ab480.firebaseapp.com/__/auth/handler'
		],
		javascript_origins: [
			'http://localhost',
			'http://localhost:8100',
			'https://document-scanner-ab480.firebaseapp.com'
		]
	}
};

export const savePdfToDrive = functions.https.onRequest((req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		res.status(200).json({});
	} else {
		console.log('0');

		// axios
		// 	.post(
		// 		'https://oauth2.googleapis.com/token',
		// 		{
		// 			client_id: creds.web.client_id,
		// 			client_secret: creds.web.client_secret,
		// 			refresh_token: req.body.token,
		// 			grant_type: 'refresh_token'
		// 		},
		// 		{
		// 			headers: {
		// 				'Content-Type': 'application/x-www-form-urlencoded'
		// 			}
		// 		}
		// 	)
		// 	.then((res) => {
		// 		console.log(res);
		// 	});

		const access_token = '';

		axios.get(
			`https://www.googleapis.com/drive/v3/files?access_token=${access_token}`
		);

		// const drive = google.drive({ version: 'v3' });
		// console.log('1');
		// drive.files.list(
		// 	{
		// 		pageSize: 10,
		// 		fields: 'nextPageToken, files(id, name)'
		// 	},
		// 	(err, res) => {
		// 		if (err) return console.log('The API returned an error: ' + err);
		// 		const files = res!.data.files;
		// 		if (files!.length) {
		// 			console.log('Files:');
		// 			files!.map((file) => {
		// 				console.log(`${file.name} (${file.id})`);
		// 			});
		// 		} else {
		// 			console.log('No files found.');
		// 		}
		// 	}
		// );
	}
	res.status(200).json({
		data: req.body
	});
});
