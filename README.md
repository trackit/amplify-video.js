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
import awsVideoConfig from "./aws-video-exports";

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
  "Action": [
    "mobiletargeting:PutEvents",
    "mobiletargeting:UpdateEndpoint"
  ],
  "Resource": "*",
  "Effect": "Allow"
}
``` 
TODO: Complete this part


#### Playback
```ts
import Video from 'amplify-video.js/dist';
import awsVideoConfig from "./aws-video-exports";

(async () => {
    const { data } = await Video.playback(vodAssetId, { awsOutputVideo: awsVideoConfig.awsOutputVideo });
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
    videojs.Hls.xhr.beforeRequest = (
      options
    ) => {
      options.uri = `${options.uri}${this.props.token}`
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
          <video ref={(node) => { this.videoNode = node; }} className="video-js"></video>
        </div>
      </div>
    );
  }
}
```

#### React (TSX)
```tsx
import React from "react";
import videojs from "video.js";
import "./VideoPlayer.css";
import "video.js/dist/video-js.css";

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
    videojs.Vhs.xhr.beforeRequest = (
      options: any
    ) => {
      options.uri = `${options.uri}${this.options?.token}`
      return options;
    };

    this.player = videojs(this.videoNode, this.options).ready(function () {
      console.log("onPlayerReady", this);
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