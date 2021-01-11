import { ref } from 'vue';
import { db, storage, auth } from '@/firebase';

export interface Doc {
	description: string[];
	tags: string[];
	url: string;
}

export function queryDB() {
	const docs = ref<Doc[]>([]);

	// const test = {
	// 	description: ['test1', 'test2'],
	// 	tags: ['tag1']
	// } as Doc;

	// for (let i = 0; i < 20; i++) {
	// 	const test = {
	// 		description: [`desc ${i}`],
	// 		tags: [`tag ${i}`]
	// 	} as Doc;
	// 	docs.value = [test, ...docs.value];
	// }

	// eslint-disable-next-line
	const bucket = 'document-scanner-ab480.appspot.com';
	const owner = auth.currentUser!.uid;

	const dbRef = db
		.collection('users')
		.doc(owner)
		.collection('documents');

	// Get all the documents from firestore
	dbRef.get().then((snapshot) => {
		snapshot.forEach((doc) => {
			const url = `gs://${bucket}/${owner}/${doc.id}.pdf`;
			const storageRef = storage.refFromURL(url);
			storageRef.getDownloadURL().then((url) => {
				const docData = doc.data();
				const data = {
					description: docData.description,
					tags: docData.tags,
					url
				} as Doc;
				// Add the document to the docs array
				docs.value = [data as Doc, ...docs.value];
			});
		});
	});

	return {
		docs
	};
}
