import { ref } from 'vue';
import {
	Plugins,
	CameraResultType,
	CameraSource,
	CameraPhoto
} from '@capacitor/core';
import { alertController } from '@ionic/vue';
// import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { storage } from '@/firebase';

export interface Photo {
	filepath: string;
	webviewPath?: string;
	metadata: string[];
	tags: string[];
	base64Data: string;
}

export function usePhotos() {
	const { Camera } = Plugins;
	const photos = ref<Photo[]>([]);

	const convertBlobToBase64 = (blob: Blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.readAsDataURL(blob);
		});

	const saveAsPDF = () => {
		// const pdf = new jsPDF({ format: [280, 216], unit: 'mm', compress: true });
		const len = photos.value.length - 1;
		// for (let i = 0; i <= len; ++i) {
		// 	pdf.addImage(
		// 		photos.value[len - i].base64Data,
		// 		'PNG',
		// 		0,
		// 		-216,
		// 		280,
		// 		216,
		// 		'' + i,
		// 		'NONE',
		// 		270
		// 	);
		// 	if (i < len) {
		// 		pdf.addPage();
		// 	}
		// }
		// pdf.save('test.pdf');
		// console.log(pdf.output());
		// console.log(pdf);
		const zip = new JSZip();

		for (let i = 0; i <= len; i++) {
			const filename = photos.value[i].filepath;
			const data = photos.value[i].base64Data.split(
				'data:image/png;base64,'
			)[1];
			zip.file(filename, data, { base64: true });
		}

		zip.generateAsync({ type: 'uint8array' }).then((data) => {
			// const visionBucket = 'document-scanner-ab480-vision';
			const resultBucket = 'document-scanner-ab480-results';
			const filePath = 'test.zip';
			const url = `gs://${resultBucket}/${filePath}`;

			storage
				.refFromURL(url)
				.put(data)
				.catch((err) => {
					console.log(err);
				});
		});
	};

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
			metadata: [],
			tags: [],
			base64Data
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
					photos.value = [image, ...photos.value];
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
		saveAsPDF
	};
}
