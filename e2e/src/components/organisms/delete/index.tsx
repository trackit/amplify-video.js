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

const Delete = (props: Props) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!inputRef.current.value) return;
    const data = await Video.delete(inputRef.current.value, {
      bucket: awsvideoconfig.awsInputVideo,
    });
    props.callback(data);
    setLoading(false);
    console.log('data', data);
  };

  return (
    <Block
      dataCy={'delete'}
      className={props.className}
      title="Delete"
      button="Delete file"
      disabled={loading}
      onClick={async () => await handleSubmit()}
    >
      {props.children}
      <Input
        type="text"
        data-cy="delete-input"
        disabled={loading}
        forwardref={inputRef}
      />
    </Block>
  );
};

export default Delete;
