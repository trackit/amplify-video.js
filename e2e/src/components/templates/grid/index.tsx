import { AmplifySignOut } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import Upload from 'components/organisms/upload';
import Metadata from 'components/organisms/metadata';
import { useState } from 'react';

import './style.scss';

const Grid = () => {
  const [result, setResult] = useState<any>(null);
  return (
    <div className={classNames('container')}>
      <AmplifySignOut className={classNames('header')} />
      <Upload
        title="Upload"
        button="Upload"
        callback={(data: any) => setResult({ upload: data, ...result })}
      >
        <p>
          Testing Upload method
          <br />
          <code>Video.upload();</code>
        </p>
        <pre>
          {result && result.upload ? JSON.stringify(result.upload, null, 2) : null}
        </pre>
      </Upload>
      <Metadata
        title="Upload"
        button="Upload"
        callback={(data: any) => setResult({ metadata: data, ...result })}
      >
        <p>
          Testing Metadata method
          <br />
          <code>Video.metadata();</code>
        </p>
        <pre>
          {result && result.metadata ? JSON.stringify(result.metadata, null, 2) : null}
        </pre>
      </Metadata>
    </div>
  );
};

export default Grid;
