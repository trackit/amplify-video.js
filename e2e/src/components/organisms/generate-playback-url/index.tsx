import {
  MouseEventHandler,
  MutableRefObject,
  ReactNode,
  useRef,
  useState,
} from 'react';
import Block from 'components/molecules/block';
import Input from 'components/atoms/input';
import Video from 'amplify-video.js/dist';
import awsvideoconfig from 'aws-video-exports';

interface Props {
  children?: ReactNode;
  className?: string;
  title: string;
  button?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  callback?: any;
}

const PlaybackUrl = (props: Props) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputRef.current.value) return;
    setLoading(true);
    const vodAssetVideoId = inputRef.current.value;
    const data = await Video.playback(vodAssetVideoId, {
      awsOutputVideo: awsvideoconfig.awsOutputVideo,
    });
    props.callback(data);
    setLoading(false);
  };

  return (
    <Block
      dataCy={'playback'}
      className={props.className}
      title={props.title}
      button={props.button}
      disabled={loading}
      onClick={async () => await handleSubmit()}
    >
      {props.children}
      <Input
        type="text"
        data-cy="playback-input"
        disabled={loading}
        forwardref={inputRef}
      />
    </Block>
  );
};

export default PlaybackUrl;
