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
			const newDoc = change.doc.data() as Doc;

			// Determine what to do when a doc is added, modified, or removed from firestore
			switch (change.type) {
				// Run when a new doc is added to firestore
				case 'added': {
					// Add the document to the docs array
					docs.value = [newDoc, ...docs.value];
					break;
				}
				// Run when a doc is modified in firestore
				case 'modified': {
					// Get the index of the old value and set it to new
					const index = docs.value.findIndex((doc) => doc.date === newDoc.date);
					docs.value[index] = newDoc;
					break;
				}
				// Run when a doc is removed from firestore
				case 'removed': {
					// Get the index of the old value and remove it from the array
					const index = docs.value.findIndex((doc) => doc.date === newDoc.date);
					docs.value.splice(index, 1);
					break;
				}
			}
		});
	});

	return {
		docs
	};
}
