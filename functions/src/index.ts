import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

admin.initializeApp(functions.config().firebase);

// Listen for object changes on default storage bucket
export const saveToDrive = functions.storage
	.object()
	.onFinalize((object: ObjectMetadata) => {
		const gcs = new Storage();

		const bucket = gcs.bucket(object.bucket);
		const fullFileName = object.name;
		const fileName = fullFileName?.split('.zip')[0];
	});
