# Code snippets for testing / browser one-liners

## RTC Session

### List session codecs

#### List `Sender` (Me) codecs

```js
    currentCallRTCSession.connection
    .getSenders()
    .filter(s => s.track && s.track.kind === 'video')
    .flatMap(s => (s.getParameters().codecs || []).map(c => ({mimeType: c.mimeType, clockRate: c.clockRate, sdpFmtpLine: c.sdpFmtpLine})));

/*
    => [
        {
            "mimeType": "video/VP9",
            "clockRate": 90000,
            "sdpFmtpLine": "profile-id=0"
        }
    ]
*/
```

#### List `Receiver` (Remote) codecs

```js
    currentCallRTCSession.connection
    .getReceivers()
    .filter(r => r.track && r.track.kind === 'video')
    .flatMap(r => (r.getParameters().codecs || []).map(c => ({mimeType: c.mimeType, clockRate: c.clockRate, sdpFmtpLine: c.sdpFmtpLine})));

/* 
    => [
        {
            "mimeType": "video/VP9",
            "clockRate": 90000,
            "sdpFmtpLine": "profile-id=0"
        }
    ]
*/
```


## Devices

### Get call session camera capabilities (possible resolutions, frame rates, etc.)

```js

    currentCallRTCSession.connection
    .getSenders()
    .find((s) => s.track?.kind === 'video')
    .track.getCapabilities();

/*
   => {
        "aspectRatio": {
            "max": 1920,
            "min": 0.0005208333333333333
        },
        "deviceId": "630bd07da739cfeccdf66c217ce93ed8d18b1c8aeec04a82024db9a4736d2b9c",
        "facingMode": [],
        "frameRate": {
            "max": 30,
            "min": 0
        },
        "groupId": "3136f3ecf5c906e593e2903d6c754d678cf755e010c68ac5d2369b6f52153ba2",
        "height": {
            "max": 1920,
            "min": 1
        },
        "resizeMode": [
            "none",
            "crop-and-scale"
        ],
        "width": {
            "max": 1920,
            "min": 1
        }
    }
*/
```

### Get call session _Actual_ camera settings

```js
    currentCallRTCSession.connection
    .getSenders()
    .find((s) => s.track?.kind === 'video')
    .track.getSettings();

/*
    => {
        "aspectRatio": 1.3333333333333333,
        "deviceId": "630bd07da739cfeccdf66c217ce93ed8d18b1c8aeec04a82024db9a4736d2b9c",
        "frameRate": 30,
        "groupId": "669bef7e08d999e0be61c1ee8f7ad0b8b180f992affb31448473e132b58deb76",
        "height": 480,
        "resizeMode": "none",
        "width": 640
    }
 */
```

### Apply specific camera settings

```js
currentCallRTCSession.connection
    .getSenders()
    .find((s) => s.track?.kind === 'video')
    .track.applyConstraints({
			width: { ideal: 1920 }, // or 64, for testing
            height: { ideal: 1080 }, // or 64, for testing
            frameRate: { ideal: 30 },
	});
```
