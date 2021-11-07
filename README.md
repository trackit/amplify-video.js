# amplify-video.js

amplify-video.js is an unofficial client library that is purpose built for Amplify Video managed resources. It's a superset of the existing amplify.js libraries for video asset.

## Installation

TODO: Remove when first release

```sh
$ npm install --save amplify-video.js
```

```ts
import Video from 'amplify-video.js';
```

## Local development setup

```sh
$ npm install -g
$ npm run dev
```

and then

```ts
import Video from 'amplify-video.js/dist';
```

\*`npm run dev` will watch for changes in your file compile your project based on `tsconfig.json` file

## Tests

Unit-tests are located in `unit-tests/` directory, all unit-tests must go here.

End-to-end tests are located in `e2e/` directory, it contains a React Application and Cypress allowing us to test real use cases with the library simulating user interaction in a browser.

You can run unit-tests and end-to-end tests independently

### Unit-tests only

```sh
$ npm run unit-test
```

If you want to watch changes in your files you can pass --watch to previous command.

```sh
$ npm run unit-test -- --watch
```

### End-to-end tests only (no GUI)

```sh
$ npm run cypress
```

### Both (unit & end-to-end tests)

```sh
$ npm test
```

For more information about end-to-end testing check [README.md](./e2e/README.md "e2e's README.md") in `e2e` directory.

## How to use

### Configuration and registration

```ts
import Amplify from 'aws-amplify';
import Video from 'amplify-video.js/dist';
import awsconfig from './aws-exports';
import awsvideoconfig from 'aws-video-exports';

Amplify.configure(awsconfig);
Amplify.register(Video);
```

### Video Upload

```ts
import Video from 'amplify-video.js';
import awsvideoconfig from 'aws-video-exports';

const params = {
  bucket: awsvideoconfig.awsInputVideo,
};
const metadata = {
  title: 'amplify-video.js rocks!',
  description: 'Awesome description',
};

const { data } = await Video.upload(file, metadata, params);
```

### Playback URL generation

```ts
import Video from 'amplify-video.js';
import awsVideoConfig from './aws-video-exports';

const vodAssetId = 'rand-uuid-4242-4242-4242';
const params = {
  awsOutputVideo: awsVideoConfig.awsOutputVideo,
};

const { data } = await Video.playback(vodAssetId, params);
```

### Metadata fetch

```ts
import Video from 'amplify-video.js';
import awsVideoConfig from './aws-video-exports';

const vodAssetId = 'rand-uuid-4242-4242-4242';

const { data } = await Video.metadata(vodAssetId);
```

### Metadata update

```ts
import Video from 'amplify-video.js';
import awsVideoConfig from './aws-video-exports';

const vodAssetId = 'rand-uuid-4242-4242-4242';
const metadata = {
  title: 'This is a new title',
  description: 'And a new awesome description',
};

const { data } = await Video.metadata(vodAssetId, metadata);
```

#### Delete

```ts
import Video from 'amplify-video.js';
import awsVideoConfig from './aws-video-exports';

const params = {
  bucket: awsvideoconfig.awsInputVideo,
};
const vodAssetId = 'rand-uuid-4242-4242-4242';

const { data } = await Video.delete(vodAssetId, params);
```
