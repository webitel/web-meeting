import { useCameraStore } from '../stores/camera';

export const useCameraFlip = () => {
	const cameraStore = useCameraStore();

	function flipCamera() {
		try {
			const currentDeviceId = cameraStore.selectedDeviceId;

			// exactly two cameras on mobile: target = the other one, matched by deviceId.
			// deviceId comparison avoids relying on non-standard label / facingMode strings.
			const targetDevice = cameraStore.devicesList.find(
				(device) => device.deviceId !== currentDeviceId,
			);

			if (!targetDevice?.deviceId) return;

			// reuse existing device-switch chain (stop-then-start inside
			// startSelectedDeviceStream).
			// no probe getUserMedia here — devices that allow only one active camera
			// at a time (some Android/iOS) would throw NotReadableError otherwise.
			cameraStore.setPreferredDevice(targetDevice.deviceId);
		} catch (err) {
			console.warn('Camera flip failed:', err);
		}
	}

	return {
		flipCamera,
	};
};
