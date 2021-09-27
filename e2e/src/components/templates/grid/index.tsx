import { useState } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import Upload from 'components/organisms/upload';
import FetchMetadata from 'components/organisms/fetch-metadata';
import UpdateMetadata from 'components/organisms/update-metadata';
import PlaybackUrl from 'components/organisms/generate-playback-url';

import './style.scss';
import VideoPlayer from 'components/organisms/video-player';
import Delete from 'components/organisms/delete';

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
      <Delete
        title="Delete"
        button="Upload"
        callback={(data: any) => setResult({ delete: data, ...result })}
      >
        <p>
          Testing Delete method
          <br />
          <code>Video.delete();</code>
        </p>
        <pre data-cy="pre-delete">
          {result && result.delete
            ? JSON.stringify(result.delete, null, 2)
            : null}
        </pre>
      </Delete>
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
      <VideoPlayer title="Video Player" button="Configure"></VideoPlayer>
    </div>
  );
};

export default Grid;
