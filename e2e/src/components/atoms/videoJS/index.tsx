import React, { MutableRefObject } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoJS = (props: any) => {
  const videoRef = React.useRef() as MutableRefObject<HTMLVideoElement>;
  const playerRef = React.useRef() as MutableRefObject<VideoJsPlayer | null>;
  const { options, onReady } = props;

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player: any = (playerRef.current = videojs(
        videoElement,
        options,
        () => {
          console.log('player is ready');
          onReady && onReady(player);
        },
      ));
    } else {
      // @ts-ignore
      videojs.Vhs.xhr.beforeRequest = (reqOptions: any) => {
        reqOptions.uri = `${reqOptions.uri}${options.token}`;
        return reqOptions;
      };
      const player: any = playerRef.current;
      player.src(options.sources);
    }
  }, [options, onReady]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoJS;
