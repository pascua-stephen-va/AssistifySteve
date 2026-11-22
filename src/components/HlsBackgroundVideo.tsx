import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HlsBackgroundVideoProps {
  src: string;
  flipped?: boolean;
  overlayClassName?: string;
  fadeBottom?: boolean;
}

export const HlsBackgroundVideo: React.FC<HlsBackgroundVideoProps> = ({
  src,
  flipped = false,
  overlayClassName = 'bg-black/35',
  fadeBottom = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    let hls: Hls | null = null;

    const handleVideoError = () => {
      setHasError(true);
    };

    const handleLoadedMetadata = () => {
      video.play().catch(() => {
        // Autoplay may be blocked by browser policy; keep silent fallback
      });
    };

    video.addEventListener('error', handleVideoError);

    const isHlsStream = /\.m3u8(\?|$)/i.test(src);

    if (!isHlsStream) {
      video.src = src;
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay may be blocked by browser policy; keep silent fallback
        });
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setHasError(true);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    } else {
      setHasError(true);
    }

    return () => {
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Subtle atmospheric fallback backdrop if HLS stream cannot load offline */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(78,133,191,0.18)_0%,rgba(10,10,10,0.95)_70%)]"
      />

      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-75 ${
            flipped ? 'scale-y-[-1]' : ''
          }`}
        />
      )}

      {/* Measured contrast scrim */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* Bottom fade into --bg */}
      {fadeBottom && (
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      )}
    </div>
  );
};
