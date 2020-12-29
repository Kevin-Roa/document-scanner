import { ref } from 'vue';
import {
	Plugins,
	CameraResultType,
	CameraSource,
	CameraPhoto
} from '@capacitor/core';
import { alertController } from '@ionic/vue';
import { jsPDF } from 'jspdf';
// import { google } from 'googleapis';
// import JSZip from 'jszip';
// import { Zip } from 'zip-lib';
// import { storage } from '@/firebase';
// import * as fs from 'fs-extra';
// import { tmpdir } from 'os';
export interface Photo {
	filepath: string;
	webviewPath?: string;
	metadata: string[];
	tags: string[];
	base64Data: string;
}

function driveUpload() {
	// const drive = google.drive({ version: 'v3' });
	// drive.files.list(
	// 	{
	// 		pageSize: 10,
	// 		fields: 'nextPageToken, files(id, name)'
	// 	},
	// 	(err: any, res: any) => {
	// 		const files = res.data.files;
	// 		if (files.length) {
	// 			console.log('Files:');
	// 			files.map((file: any) => {
	// 				console.log(`${file.name} (${file.id})`);
	// 			});
	// 		} else {
	// 			console.log('No files found.');
	// 		}
	// 	}
	// );
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
		driveUpload();
		// pdf.save('test.pdf');
		// console.log(pdf.output());
		// console.log(pdf);
		//const zip = new JSZip();
		// const zip = new Zip();

		// for (let i = 0; i <= len; i++) {
		// 	const filename = photos.value[i].filepath;
		// 	const data = photos.value[i].base64Data.split(
		// 		'data:image/png;base64,'
		// 	)[1];
		// 	zip.file(filename, data, { base64: true });
		// 	// zip.addFile(photos.value[i].webviewPath!);
		// }

		// const filePath = tmpdir() + '/test.zip';
		// zip.archive(filePath).then(() => {
		// 	fs.readFile(filePath, (err: Error, data: ArrayBuffer) => {
		// 		if (err) {
		// 			console.log(err);
		// 		} else {
		// 			const resultBucket = 'document-scanner-ab480-vision';
		// 			const fileName = new Date().getTime() + '.zip';
		// 			const url = `gs://${resultBucket}/${fileName}`;
		// 			storage
		// 				.refFromURL(url)
		// 				.put(data)
		// 				.catch((err) => {
		// 					console.log(err);
		// 				});
		// 		}
		// 	});
		// });

		// zip
		// 	.generateAsync({
		// 		type: 'blob',
		// 		compression: 'DEFLATE',
		// 		platform: 'UNIX'
		// 	})
		// 	.then((data: Blob) => {
		// 		const resultBucket = 'document-scanner-ab480-vision';
		// 		const filePath = new Date().getTime() + '.zip';
		// 		const url = `gs://${resultBucket}/${filePath}`;

		// 		storage
		// 			.refFromURL(url)
		// 			.put(data)
		// 			.catch((err) => {
		// 				console.log(err);
		// 			});
		// 	});
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
