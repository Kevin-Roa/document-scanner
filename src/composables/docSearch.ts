import { ref } from 'vue';
import { db, auth } from '@/firebase';

export interface Doc {
	description: string[];
	tags: string[];
	date: string;
	pdfUrl: string;
	imgUrl: string;
}

export function queryDB() {
	const docs = ref<Doc[]>([]);

	// eslint-disable-next-line
	const owner = auth.currentUser!.uid;

	// Reference to this user's document collection
	const dbRef = db
		.collection('users')
		.doc(owner)
		.collection('documents');

	// Get all the documents from firestore
	// Detect changes automatically
	dbRef.onSnapshot((querySnapshot) => {
		querySnapshot.docChanges().forEach((change) => {
			// Add the document to the docs array
			docs.value = [change.doc.data() as Doc, ...docs.value];
		});
	});

	return {
		docs
	};
}
