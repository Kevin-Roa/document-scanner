import { ref } from 'vue';
import {
	Plugins,
	CameraResultType,
	CameraSource,
	CameraPhoto
	// FilesystemDirectory
} from '@capacitor/core';
import { alertController } from '@ionic/vue';

export interface Photo {
	filepath: string;
	webviewPath?: string;
	isChecked: boolean;
}

export function usePhotos() {
	const {
		Camera
		//  Filesystem
	} = Plugins;
	const photos = ref<Photo[]>([]);

	// const convertBlobToBase64 = (blob: Blob) =>
	// 	new Promise((resolve, reject) => {
	// 		const reader = new FileReader();
	// 		reader.onerror = reject;
	// 		reader.onload = () => {
	// 			resolve(reader.result);
	// 		};
	// 		reader.readAsDataURL(blob);
	// 	});

	const savePicture = async (
		photo: CameraPhoto,
		fileName: string
	): Promise<Photo> => {
		// let base64Data: string;
		// Fetch the photo, read as a blob, then convert to base64 format
		// const response = await fetch(photo.webPath!);
		// const blob = await response.blob();
		// const base64Data = (await convertBlobToBase64(blob)) as string;

		// const savedFile = await Filesystem.writeFile({
		// 	path: fileName,
		// 	data: base64Data,
		// 	directory: FilesystemDirectory.Data
		// });

		// Use webPath to display the new image instead of base64 since it's
		// already loaded into memory

		return {
			filepath: fileName,
			webviewPath: photo.webPath,
			isChecked: false
		};
	};

	const takePhoto = async () => {
		const cameraPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			allowEditing: true,
			quality: 100,
			webUseInput: true
		});

		const fileName = new Date().getTime() + '.jpeg';
		const savedFileImage = await savePicture(cameraPhoto, fileName);

		photos.value = [savedFileImage, ...photos.value];
	};

	const hasSelection = () => {
		return photos.value.find((i) => i.isChecked === true) !== undefined;
	};

	let selectAll = true;
	const selectAllPhotos = () => {
		if (!hasSelection()) {
			selectAll = true;
		}
		for (let i = 0; i < photos.value.length; i++) {
			photos.value[i].isChecked = selectAll;
		}
		selectAll = !selectAll;
	};

	const removePhotos = async () => {
		if (hasSelection()) {
			const alert = await alertController.create({
				header: 'Confirm',
				subHeader: 'Are you sure you want to delete the selected photos?',
				buttons: [
					{
						text: 'Cancel',
						role: 'cancel'
					},
					{
						text: 'Delete',
						handler: () => {
							photos.value = photos.value.filter(
								(i: any) => i.isChecked === false
							);
						}
					}
				]
			});
			alert.present();
		}
	};

	return {
		takePhoto,
		photos,
		hasSelection,
		selectAllPhotos,
		removePhotos
	};
}
