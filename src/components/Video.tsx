import React, { useState } from 'react';
import { Stream } from "@cloudflare/stream-react";

const Video = ({ videoId }: any) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black min-h-[200px] md:min-h-[610px]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white" />
        </div>
      )}

      <Stream
        controls
        autoplay={false}
        responsive
        src={videoId}
        onLoadedData={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        className="w-full h-auto p-0 stream-wrapper"
      />
    </div>
  );
};

export default Video;

