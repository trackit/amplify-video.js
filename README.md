# amplify-video.js
amplify-video client library that is purpose built for Amplify Video managed resources. It's a superset of the existing amplify.js libraries for video asset.

### Local development setup
Inside `amplify-video.js` directory run `npm link` then in your project directory execute in turn the command `npm link amplify-video.js`

For more information about `npm link` command, click on the [link](https://docs.npmjs.com/cli/v7/commands/npm-link).

You can now import you module inside your project like below:

```ts
import Video from 'amplify-video.js';
```

To unlink module run the following in your project directory `npm unlink --no-save amplify-video.js`.

### How to use 

#### Configuration and registration
```ts
import Amplify from 'aws-amplify';
import Video from 'amplify-video.js/dist';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.register(Video);
```


#### Upload
```ts
import Video from 'amplify-video.js/dist';

async function upload(e) {
    const file = e.target.files[0];

    await Video.upload(file, { bucket: 'your-input-bucket' });
}
```