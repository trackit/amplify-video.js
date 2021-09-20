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

const Upload = (props: Props) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!inputRef.current.files) return;
    const bucket = awsvideoconfig.awsInputVideo;
    const file = inputRef.current.files[0];
    const data = await Video.upload(
      file,
      { description: 'e2e test from Cypress', title: 'Upload method test' },
      {
        bucket,
        contentType: 'video/*',
        progressCallback: (progress: any) => {
          const { loaded, total } = progress;
          const percent = Math.round((loaded / total) * 100);
          console.log(`Uploaded: ${percent}%`);
        },
      },
    );
    props.callback(data);
    setLoading(false);
    console.log('data', data);
  };

  return (
    <Block
      dataCy={"submit"}
      className={props.className}
      title="Upload"
      button="Upload file"
      disabled={loading}
      onClick={async () => await handleSubmit()}
    >
      {props.children}
      <Input type="file" disabled={loading} forwardref={inputRef} />
    </Block>
  );
};

export default Upload;
