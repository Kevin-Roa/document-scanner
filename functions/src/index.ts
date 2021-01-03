import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

admin.initializeApp(functions.config().firebase);

// Listen for object changes on default storage bucket
export const saveToDrive = functions.storage
	.object()
	.onFinalize((object: ObjectMetadata) => {
		const bucket = admin.storage().bucket(object.bucket);
		const fullFileName = object.name;
		// const fileName = fullFileName?.split('.pdf')[0];
		// const filePath = `gs://${bucket}/${fullFileName}`;

		// Only run code when a pdf is added to the bucket
		if (fullFileName?.includes('.pdf')) {
			// Upload to google drive

			// Remove pdf from cloud bucket
			return bucket.file(fullFileName).delete();
		} else {
			console.log('Uploaded file is not a PDF.');
			return null;
		}
	});
