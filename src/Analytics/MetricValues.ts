export default {
  PLAY: {
    at: '', // playback position
    duration: '',
  },
  FIRSTFRAME: {
    connection_type: '', // 3g or 4g
    package: '', // HLS or DASH
    resolution: '',
    fps: '',
    avg_bitrate: '',
    time_millisecond: '',
  },
  SEEK: {
    seek_from: '',
    seek_to: '',
    connection_type: '',
    time_millisecond: '',
  },
  BUFFER: {
    buffer_type: '',
    at: '', // playback position
    connection_type: '',
    time_millisecond: '',
  },
  STREAM: {
    at: '',
    connection_type: '',
    package: '',
    resolution: '',
    fps: '',
    avg_bitrate: '',
    duration: '',
  },
  STEP: {
    at: '', // playback position
    bitrate_from: '',
    bitrate_to: '',
    direction: '', // quality UP or DOWN
    package: '',
    resolution: '',
    fps: '',
    connection_type: '',
  },
  STOP: {
    at: '',
    duration: '',
    connection_type: '',
    package: '',
    resolution: '',
    fps: '',
    avg_bitrate: '',
  },
  PAUSE: {
    at: '',
    duration: '',
  },
  ERROR: {
    at: '',
    message: '',
  },
};
