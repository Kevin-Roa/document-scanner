import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as vision from '@google-cloud/vision';

admin.initializeApp(functions.config().firebase);

const visionClient = new vision.ImageAnnotatorClient();

const visionBucket = 'document-scanner-ab480-vision';
// const resultBucket = 'document-scanner-ab480-results';

export const pdfScanner = functions.storage
	.bucket(visionBucket)
	.object()
	.onFinalize(async (object: any) => {
		const filePath = object.name;
		const imageUri = `gs://${visionBucket}/${filePath}`;

		const [result] = await visionClient.documentTextDetection(imageUri);

		// // const imageDestUri = `gs://${resultBucket}/${filePath}`;

		const docId = filePath.split('.png')[0];

		const docRef = admin
			.firestore()
			.collection('photos')
			.doc(docId);

		docRef.set({ text: result.fullTextAnnotation!.text });

		// const inputConfig = {
		// 	mimeType: 'application/pdf',
		// 	gcsSource: { uri: imageUri }
		// };

		// const features = [{ type: 'DOCUMENT_TEXT_DETECTION' }];

		// const request = {
		// 	requests: [{ inputConfig, features }]
		// } as vision.protos.google.cloud.vision.v1.IBatchAnnotateFilesRequest;

		// const [result] = await visionClient.batchAnnotateFiles(request);
		// docRef.set({
		// 	resp: result.responses![0].full_text_annotation.text
		// });
	});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
