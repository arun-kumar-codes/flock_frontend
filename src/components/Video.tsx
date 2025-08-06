// import React from 'react';

// const Video = ({ url }: any) => {
//   console.log("Video URL:", url);

//   return (
//     <div className="w-full">
//       <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-transparent">
//         <iframe
//           src={url}
//           className="absolute top-0 left-0 w-full h-full"
//           style={{ border: 'none' }}
//           allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
// };

// export default Video;


// import React from 'react';
// import { Stream } from "@cloudflare/stream-react";

// const Video = ({ videoId}: any)  => {

//   return (
//     <div className="w-full h-full rounded-lg overflow-hidden">
//       <Stream
//         controls
//         autoplay={false}
//         responsive
//         src={videoId}
//       />
//     </div>
//   );
// };

// export default Video;


import React, { useState } from 'react';
import { Stream } from "@cloudflare/stream-react";

const Video = ({ videoId }: any) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
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
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        className="w-full h-auto"
      />
    </div>
  );
};

export default Video;

