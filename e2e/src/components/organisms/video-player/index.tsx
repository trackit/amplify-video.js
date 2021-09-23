import React, {
  MouseEventHandler,
  MutableRefObject,
  ReactNode,
  useState,
} from 'react';
import VideoJS from 'components/atoms/videoJS';
import Block from 'components/molecules/block';
import Input from 'components/atoms/input';

interface Props {
  children?: ReactNode;
  className?: string;
  title: string;
  button?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  callback?: any;
}

const VideoPlayer = (props: Props) => {
  const playerRef = React.useRef(null);
  const urlInputRef = React.useRef() as MutableRefObject<HTMLInputElement>;
  const tokenInputRef = React.useRef() as MutableRefObject<HTMLInputElement>;
  const [videoJsOptions, setVideoJsOptions] = useState<any>({
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
  });

  const handleSubmit = async () => {
    if (!urlInputRef.current.value || !tokenInputRef.current.value) return;
    setVideoJsOptions({
      ...videoJsOptions,
      token: tokenInputRef.current.value,
      sources: [
        {
          src: `${urlInputRef.current.value}`,
          type: 'application/x-mpegURL',
        },
      ],
    });
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  return (
    <Block
      dataCy={'player'}
      className={props.className}
      title="Video Player"
      button={props.button}
      onClick={async () => await handleSubmit()}
    >
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <p>
        <label>Url: </label>
        <Input type="text" data-cy="video-url-input" forwardref={urlInputRef} />
      </p>
      <p>
        <label>Token: </label>
        <Input
          type="text"
          data-cy="video-token-input"
          forwardref={tokenInputRef}
        />
      </p>
      {props.children}
    </Block>
  );
};

export default VideoPlayer;
