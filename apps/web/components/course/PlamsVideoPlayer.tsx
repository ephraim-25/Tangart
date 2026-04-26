"use client";

import React, { useEffect, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface PlamsVideoPlayerProps {
  playbackId: string;
  playbackToken: string;
  drmToken: string;
  userEmail: string;
}

export function PlamsVideoPlayer({ playbackId, playbackToken, drmToken, userEmail }: PlamsVideoPlayerProps) {
  // Anti-tamper offset for the dynamic watermark
  const [offset, setOffset] = useState({ top: '10%', left: '10%' });

  useEffect(() => {
    // Randomly move the watermark to prevent simple cropping
    const interval = setInterval(() => {
      setOffset({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      });
    }, 15000); // changes every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="video-container" 
      style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}
      onContextMenu={(e) => e.preventDefault()} // Disable right click for extra basic security
    >
      <MuxPlayer
        playbackId={playbackId}
        tokens={{
          playback: playbackToken,
          thumbnail: playbackToken,
          storyboard: playbackToken,
        }}
        customDomain="mux.plamsart.com" // Just an example, assuming we'd use a proxy or pass it differently
        // If DRM requires specific config in MuxPlayer:
        style={{
          height: '100%',
          width: '100%',
          // Styling Mux Player UI via CSS Variables for "Galerie Noire" look
          // Using strict types cast to allow custom CSS properties
          ...( {
            '--mux-player-primary-color': '#D4AF37', // accent-gold
            '--mux-player-progress-color': '#D4AF37',
            '--mux-player-control-bar-background': 'rgba(10, 10, 10, 0.85)',
          } as React.CSSProperties )
        }}
        metadata={{
          video_title: 'Galerie Noire Lesson',
          viewer_user_id: userEmail,
        }}
      />
      
      {/* Dynamic CSS Watermark (Overlay) */}
      <div
        style={{
          position: 'absolute',
          top: offset.top,
          left: offset.left,
          color: 'rgba(255, 255, 255, 0.12)', // very subtle
          fontSize: '1rem',
          fontFamily: 'var(--font-body)',
          pointerEvents: 'none', // Must not interfere with video controls
          userSelect: 'none', // Prevent highlighting
          transition: 'top 3s ease, left 3s ease',
          zIndex: 10,
          textShadow: '0px 0px 4px rgba(0,0,0,0.5)'
        }}
      >
        {userEmail}
      </div>
    </div>
  );
}
