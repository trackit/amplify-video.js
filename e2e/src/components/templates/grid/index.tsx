import { AmplifySignOut } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import Upload from 'components/organisms/upload';
import { useState } from 'react';

import './style.scss';

const Grid = () => {
  const [result, setResult] = useState(null);
  return (
    <div className={classNames('container')}>
      <AmplifySignOut className={classNames('header')} />
      <Upload
        title="Upload"
        button="Upload"
        callback={(data: any) => setResult(data)}
        className={classNames('item-left')}
      >
        <p>
          Testing Upload method
          <br />
          <code>Video.upload();</code>
        </p>
        <pre>{result ? JSON.stringify(result) : null}</pre>
      </Upload>
    </div>
  );
};

export default Grid;
