import { ref } from 'vue';
import {
	Plugins,
	CameraResultType,
	CameraSource,
	CameraPhoto
} from '@capacitor/core';
import { alertController } from '@ionic/vue';
import { jsPDF } from 'jspdf';

export interface Photo {
	filepath: string;
	webviewPath?: string;
	metadata: string[];
	tags: string[];
	base64Data: string;
	dimensions: {};
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
		const pdf = new jsPDF({ format: 'letter', unit: 'mm' });
		const len = photos.value.length - 1;
		for (let i = 0; i <= len; ++i) {
			pdf.addImage(
				photos.value[len - i].base64Data,
				'PNG',
				0,
				-200,
				279,
				216,
				'' + i,
				'NONE',
				270
			);
			if (i < len) {
				pdf.addPage();
			}
		}
		// pdf.save('test.pdf');
		console.log(pdf.output());
		// console.log(pdf);
	};

	const savePicture = async (
		photo: CameraPhoto,
		fileName: string
	): Promise<Photo> => {
		// Fetch the photo, read as a blob, then convert to base64 format
		const response = await fetch(photo.webPath!);
		const blob = await response.blob();
		const base64Data = (await convertBlobToBase64(blob)) as string;

		return {
			filepath: fileName,
			webviewPath: photo.webPath,
			metadata: [],
			tags: [],
			base64Data,
			dimensions: {}
		};
	};

	const takePhoto = async () => {
		Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
			webUseInput: true
		}).then((photo) => {
			const fileName = new Date().getTime() + '.png';
			savePicture(photo, fileName).then((image) => {
				photos.value = [image, ...photos.value];
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
