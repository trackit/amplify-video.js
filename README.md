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

#### Delete

```ts
import Video from 'amplify-video.js/dist';
import awsVideoConfig from './aws-video-exports';

(async () => {
  const data = await Video.delete('vodAssetId', {
    bucket: awsVideoConfig.awsInputVideo,
  });
  console.log(data);
  /*
        data: {
            deleteVideoObject,
            deleteVodAsset,
        }
    */
})();
```

#### Analytics

Requires `amplify add analytics`
You must add the following Actions to the inline policy of the AdminGroupRole:

```json
{
  "Action": ["mobiletargeting:PutEvents", "mobiletargeting:UpdateEndpoint"],
  "Resource": "*",
  "Effect": "Allow"
}
```

TODO: Complete this part

#### Playback

```ts
import Video from 'amplify-video.js/dist';
import awsVideoConfig from './aws-video-exports';

(async () => {
  const { data } = await Video.playback(vodAssetId, {
    awsOutputVideo: awsVideoConfig.awsOutputVideo,
  });
  console.log(data);
  // {playbackUrl: "", token: ""}
})();
```

### Video Player integration

#### React (JSX)

```jsx
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    videojs.Hls.xhr.beforeRequest = (options) => {
      options.uri = `${options.uri}${this.props.token}`;
      return options;
    };
    this.player = videojs(this.videoNode, this.props);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            ref={(node) => {
              this.videoNode = node;
            }}
            className="video-js"
          ></video>
        </div>
      </div>
    );
  }
}
```

#### React (TSX)

```tsx
import React from 'react';
import videojs from 'video.js';
import './VideoPlayer.css';
import 'video.js/dist/video-js.css';

interface VideoPlayerPropsInferface extends videojs.PlayerOptions {
  token: string;
}

export default class VideoPlayer extends React.Component<VideoPlayerPropsInferface> {
  private player?: videojs.Player;
  private videoNode?: HTMLVideoElement;
  private options?: VideoPlayerPropsInferface;

  constructor(props: VideoPlayerPropsInferface) {
    super(props);
    this.options = props;
    this.player = null;
    this.videoNode = null;
  }

  componentDidMount() {
    // @ts-ignore
    videojs.Vhs.xhr.beforeRequest = (options: any) => {
      options.uri = `${options.uri}${this.options?.token}`;
      return options;
    };

    this.player = videojs(this.videoNode, this.options).ready(function () {
      console.log('onPlayerReady', this);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="video-player">
        <div data-vjs-player>
          <video
            ref={(node: HTMLVideoElement) => {
              this.videoNode = node;
            }}
            className="vjs-fluid video-js vjs-default-skin vjs-big-play-centered"
          />
        </div>
      </div>
    );
  }
}
```

# Setup Analytics demo

1. Bootstrap your app:

```
npx create-react-app analytics
```

2. Clone forked `amplify-cli` repository to deploy the Analytics stack (https://github.com/nathanagez/amplify-cli)

```
git clone git@github.com:nathanagez/amplify-cli.git
```

3. Checkout on the correct branch

```
git checkout category-analytics/kinesis-firehose
```

4. Setup your local environment

```
# You must install yarn before
npm i -g yarn

# Linux / macOS
yarn setup-dev

# Windows
yarn setup-dev-win
```

5. Clone `amplify-video.js` repository (https://github.com/trackit/amplify-video.js)

```
git clone git@github.com:trackit/amplify-video.js.git

npm run build
```

6. Link local package folder (https://docs.npmjs.com/cli/v7/commands/npm-link/)

```
cd ~/projects/amplify-video.js # go into the package directory
npm link                       # creates global link
cd ~/projects/analytics        # go into some other package directory.
npm link amplify-video.js      # link-install the package
```

7. Init amplify project

```
cd ~/projects/analytics
amplify-dev init
```

8. Add video category

```
amplify-dev add video

? Is this a production enviroment? (Y/n) Yes

? Do you want to protect your content with signed urls? No

? Do you want Amplify to create a new GraphQL API to manage your videos? (Beta) Yes

? Please select from one of the below mentioned services: GraphQL

? Provide API name: analytics

? Choose the default authorization type for the API: Amazon Cognito User Pool

? Do you want to configure advanced settings for the GraphQL API: No, I am done.

? Do you have an annotated GraphQL schema? No

? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)

? Define your permission schema: Admins can only upload videos

? Do you want to override your GraphQL schema? Yes

? Do you want to edit your newly created model? No
```

9. Add analytics

```
amplify-dev add analytics

? Select an Analytics provider: Amazon Kinesis Firehose

? Enter a Delivery Stream name: analyticsKinesisFirehose

? How you would prefer to send records to the delivery stream ? Kinesis Data Stream

? Enter a Stream name: analyticsKinesisStream

? Enter number of shards: 1

? Do you want to configure advanced settings?: Yes

? AWS Glue database name: analyticsGlueDatabase

? AWS Glue table name: analytics-gluetable

? S3 Buffer size: 128

? S3 Buffer interval: 60

? Do you want to edit the schema now? Yes

? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (we recommend you allow this when getting started): Yes
```

```js
import Amplify from 'aws-amplify';
import Video from 'amplify-video.js/dist';

Amplify.configure(awsconfig);
Amplify.register(Video);

(async () => {
  await Video.analytics('your_stream_name', 'AWSKinesis');
})();
```

`Video.analytics` will automatically listen for video player events.

For the moment only pause events are tracked

Here is a full react sample, you can replace your App.js with this content:

```jsx
import './App.css';

import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import VideoPlayer from './VideoPlayer';
import Amplify from 'aws-amplify';
import Video from 'amplify-video.js/dist';
import awsconfig from './aws-exports';
import awsVideoConfig from './aws-video-exports';

Amplify.configure(awsconfig);
Amplify.register(Video);

function InputFiles() {
  const uploadFile = async (e) => {
    const file = e.target.files[0];

    const data = await Video.upload(
      file,
      {
        title: 'test',
        description: 'Test of upload method',
      },
      { bucket: awsVideoConfig.awsInputVideo },
    );

    console.log(data);
  };

  return (
    <div>
      <h3>Upload asset</h3>
      <input type="file" onChange={uploadFile} />
    </div>
  );
}

function App() {
  const [vodAssetId, setVodAssetId] = useState('');
  const [playback, setPlayback] = useState(null);

  useEffect(() => {
    (async () => {
      await Video.analytics('analyticsKinesisStream', 'AWSKinesis');
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {InputFiles()}
        <label>Fetch playback url of VodAssetId:</label>
        <input
          type="text"
          onChange={(e) => setVodAssetId(e.target.value)}
        ></input>
        <button
          onClick={async () => {
            const { data } = await Video.playback(vodAssetId, {
              awsOutputVideo: awsVideoConfig.awsOutputVideo,
            });
            console.log(data);
            setPlayback(data);
          }}
        >
          Get playback url
        </button>

        <h3>Video Player</h3>
        {playback ? (
          <VideoPlayer
            autoplay
            controls
            sources={[
              {
                src: playback.playbackUrl,
                type: 'application/x-mpegURL',
              },
            ]}
          />
        ) : null}
      </header>
    </div>
  );
}

export default withAuthenticator(App);
```

### 403

If you get a 403 error edit your CloudFront distribution:

Origins and Origin Groups > Edit

- Remove the region from the url (e.g: `vod-dev-output-t86r0u7e.s3.amazonaws.com`)

- Restrict Bucket Access > Use an Existing Identity > OAI created by amplify

- Yes, Edit


### Permissions

To use Kinesis Data Streams in an application, you must set the correct permissions. The following IAM policy allows the user to submit records to a specific data stream, which is identified by ARN.

(Add this statement to the authRole)

```json
{
    "Statement": [{
        "Effect": "Allow",
        "Action": "kinesis:PutRecords",
        "Resource": "arn:aws:kinesis:us-west-2:111122223333:stream/mystream"
    }]
}
```