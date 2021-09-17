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

interface Props {
  children?: ReactNode;
  className?: string;
  title: string;
  button?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  callback?: any;
}

const Metadata = (props: Props) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputRef.current.value) return;
    setLoading(true);
    const vodAssetVideoId = inputRef.current.value;
    const { data } = await Video.metadata(vodAssetVideoId);
    props.callback(data);
    setLoading(false);
  };

  return (
    <Block
      dataCy={'fetch'}
      className={props.className}
      title="Metadata"
      button="Fetch"
      disabled={loading}
      onClick={async () => await handleSubmit()}
    >
      {props.children}
      <Input type="text" disabled={loading} forwardref={inputRef} />
    </Block>
  );
};

export default Metadata;
