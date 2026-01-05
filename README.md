# web-meeting

## Config file

```jsonc
{
  // auth and portal related configuration

  "token": {
    "iss": "string", // webitel portal url
    "endpointUrl": "string", // url for portal auth token http request
    "appToken": "string", // unique key
  },

  // call configuration

  "call": {
    "host": "string", // WebSocket host for sip
    "target": "string", // sip call target
      /*
        desired video device resolution for web-meeting app user (end-client)
        basically, it's a resolution from which webrtc video call stream will try
        to start.

        for more info, see http://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#examples

        NOTE! resolution may be decreased during the call if user's device resolution or network conditions are worse.
      */
    "videoDeviceResolution": {
      "width": {
        "ideal": number, // 1920 by default. note! only "ideal" is supported
      },
      "height": {
        "ideal": number, // 1080 by default. note! only "ideal" is supported
      },
    },
  },

  // static assets URLs

  "assets": {
    "logoPicture": "string", // logo picture URL. Webitel logo by default.
    "mainBackground": "string", // app background image URL. Webitel brand gradient by default.
  },

  "lang": "string", // lang of user interface. en by default. supported languages: en, uk, ru.

  // call result form config

  "evaluation": {
    "endpointUrl": "string", // http request url to send evaluation results
    "goodGrade": number, // good grade ("success"-colored button) value
    "badGrade": number, // bad grade ("error"-colored button) value
  },
},
```

<!-- ### Configurable properties -->



### Supported config file formats

* `.json`
* `.jsonc`

### Useful links

* Example config: [config.example.jsonc](./public/config.example.jsonc)

* TypeScript type definition for config: [AppConfig.ts](./src/modules/appConfig/types/AppConfig.ts)

* Default config, merged with user config: [defaultConfig.ts](./src/modules/appConfig/defaults/defaultConfig.ts)
