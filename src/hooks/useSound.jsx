import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    // Background Ambient Music (Low, sweet, professional)
    bgMusicRef.current = new Howl({
      src: ['https://cdn.pixabay.com/audio/2022/03/15/audio_730e666993.mp3'], // Change to local path if available
      loop: true,
      volume: 0.15, // Keep it low as requested
      autoplay: false,
      html5: true, // Use HTML5 Audio for long tracks
      onloaderror: (e) => console.log('Howler error:', e),
    });

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (isMuted || !hasInteracted) {
        bgMusicRef.current.pause();
      } else {
        if (!bgMusicRef.current.playing()) {
          bgMusicRef.current.play();
        }
      }
    }
  }, [isMuted, hasInteracted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!hasInteracted) setHasInteracted(true);
  };

  const playHover = () => {
    if (isMuted) return;
    const hoverSound = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Soft pop/hover
      volume: 0.1,
    });
    hoverSound.play();
  };

  const playClick = () => {
    if (isMuted) return;
    const clickSound = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], // Soft click
      volume: 0.2,
    });
    clickSound.play();
  };

  const startAudio = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
    }
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick, hasInteracted, startAudio }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
