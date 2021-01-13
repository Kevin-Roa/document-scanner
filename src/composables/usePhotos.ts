import { ref } from 'vue';
import {
	Plugins,
	CameraResultType,
	CameraSource,
	CameraPhoto
} from '@capacitor/core';
import { alertController } from '@ionic/vue';
import { jsPDF } from 'jspdf';
import { db, auth, storage } from '@/firebase';
// import axios from 'axios';

export interface Photo {
	filepath: string;
	webviewPath?: string;
	base64Data: string;
	blob: Blob;
}

export function usePhotos() {
	const { Camera } = Plugins;
	const photos = ref<Photo[]>([]);

	const uploadPdf = (pdf: jsPDF, previewImg: Photo) => {
		// eslint-disable-next-line
		const owner = auth.currentUser!.uid;
		const bucket = 'document-scanner-ab480.appspot.com';
		const time = new Date().getTime();

		const baseUrl = `gs://${bucket}/${owner}/${time}`;
		const pdfUrl = baseUrl + '.pdf';
		const imgUrl = baseUrl + '.png';

		const pdfData = pdf.output('blob');
		const imgData = previewImg.blob;

		const dbRef = db
			.collection('users')
			.doc(owner)
			.collection('documents')
			.doc(`${time}`);

		// Create a new entry in firestore
		// Upload files and update entry with new data
		dbRef.set({ date: `${time}` }).then(() => {
			// Reference to pdf location on google cloud
			const pdfRef = storage.refFromURL(pdfUrl);
			// Upload pdf to cloud storage
			pdfRef
				.put(pdfData)
				.then(() => {
					// Add a download URL for the pdf to firestore
					pdfRef.getDownloadURL().then((url) => {
						dbRef.update({
							pdfUrl: url
						});
					});
				})
				.catch((err) => {
					console.log(err);
				});

			// Reference to preview img location on google cloud
			const imgRef = storage.refFromURL(imgUrl);
			// Upload preview image to cloud storage
			imgRef
				.put(imgData)
				.then(() => {
					// Add a download URL for the preview img to firestore
					imgRef.getDownloadURL().then((url) => {
						dbRef.update({
							imgUrl: url
						});
					});
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};

	const createPDF = () => {
		const pdf = new jsPDF({ format: [280, 216], unit: 'mm', compress: true });
		const len = photos.value.length - 1;
		for (let i = 0; i <= len; ++i) {
			pdf.addImage(
				photos.value[len - i].base64Data,
				'PNG',
				0,
				-216,
				280,
				216,
				'' + i,
				'NONE',
				270
			);
			if (i < len) {
				pdf.addPage();
			}
		}

		uploadPdf(pdf, photos.value[0]);
	};

	const convertBlobToBase64 = (blob: Blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.readAsDataURL(blob);
		});

	const savePicture = async (
		photo: CameraPhoto,
		fileName: string
	): Promise<Photo> => {
		// Fetch the photo, read as a blob, then convert to base64 format
		// eslint-disable-next-line
		const response = await fetch(photo.webPath!);
		const blob = await response.blob();
		const base64Data = (await convertBlobToBase64(blob)) as string;

		return {
			filepath: fileName,
			webviewPath: photo.webPath,
			base64Data,
			blob
		};
	};

	let lastAdded = new Date().getTime();

	const takePhoto = async () => {
		Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 60,
			webUseInput: true
		}).then((photo) => {
			const date = new Date().getTime();
			const fileName = date + '.png';

			savePicture(photo, fileName).then((image) => {
				//Prevent camera from taking duplicate pictures
				if (date - lastAdded > 1000) {
					photos.value = [...photos.value, image];
					lastAdded = new Date().getTime();
				}
			});
		});
	};

	const removePhoto = async (photo: Photo) => {
		const alert = await alertController.create({
			header: 'Confirm',
			subHeader: 'Are you sure you want to delete this photo?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel'
				},
				{
					text: 'Delete',
					handler: () => {
						photos.value = photos.value.filter(
							(i: any) => i.webviewPath !== photo.webviewPath
						);
					}
				}
			]
		});
		alert.present();
	};

	return {
		takePhoto,
		photos,
		removePhoto,
		createPDF
	};
}
