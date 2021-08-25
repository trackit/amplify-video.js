export default {
  PLAY: {
    at: '', // playback position
    duration: '',
  },
  FIRSTFRAME: {
    rtt: '', // round trip time
    connection_type: '', // 3g or 4g
    package: '', // HLS or DASH
    resolution: '',
    fps: '',
    avg_bitrate: '',
    time_millisecond: '',
    cdn_tracking_id: '',
  },
  SEEK: {
    seek_from: '',
    seek_to: '',
    // rtt: '',
    // connection_type: '',
    time_millisecond: '',
    // cdn_tracking_id: '',
  },
  BUFFER: {
    buffer_type: '',
    at: '', // playback position
    // rtt: '',
    // connection_type: '',
    time_millisecond: '',
    // cdn_tracking_id: '',
  },
  STREAM: {
    at: '',
    rtt: '',
    connection_type: '',
    package: '',
    //  aspect_ratio: '',
    resolution: '',
    fps: '',
    avg_bitrate: '',
    duration: '',
    cdn_tracking_id: '',
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
    //  aspect_ratio: '',
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
    cdn_tracking_id: '',
  },
};
