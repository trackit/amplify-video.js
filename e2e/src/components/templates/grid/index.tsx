import { useState } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import Upload from 'components/organisms/upload';
import FetchMetadata from 'components/organisms/fetch-metadata';
import UpdateMetadata from 'components/organisms/update-metadata';
import PlaybackUrl from 'components/organisms/generate-playback-url';

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
        <pre data-cy="pre-upload">
          {result && result.upload
            ? JSON.stringify(result.upload, null, 2)
            : null}
        </pre>
      </Upload>
      <FetchMetadata
        title="Metadata"
        button="Fetch"
        callback={(data: any) => setResult({ metadata: data, ...result })}
      >
        <p>
          Testing Metadata method
          <br />
          <code>Video.metadata();</code>
        </p>
        <pre data-cy="pre-metadata">
          {result && result.metadata
            ? JSON.stringify(result.metadata, null, 2)
            : null}
        </pre>
      </FetchMetadata>
      <UpdateMetadata
        title="Metadata"
        button="Update"
        callback={(data: any) =>
          setResult({ updatedMetadata: data, ...result })
        }
      >
        <p>
          Testing Metadata method
          <br />
          <code>Video.metadata();</code>
        </p>
        <pre data-cy="pre-metadata">
          {result && result.updatedMetadata
            ? JSON.stringify(result.updatedMetadata, null, 2)
            : null}
        </pre>
      </UpdateMetadata>
      <PlaybackUrl
        title="Playback url"
        button="Fetch"
        callback={(data: any) => setResult({ playbackUrl: data, ...result })}
      >
        <p>
          Testing Playback method
          <br />
          <code>Video.playback();</code>
        </p>
        <pre data-cy="pre-playback">
          {result && result.playbackUrl
            ? JSON.stringify(result.playbackUrl, null, 2)
            : null}
        </pre>
      </PlaybackUrl>
    </div>
  );
};

export default Grid;
