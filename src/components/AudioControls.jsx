import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import './AudioControls.scss';

const AudioControls = () => {
  const { isMuted, toggleMute, hasInteracted, startAudio } = useSound();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`audio-controls ${isMuted ? 'muted' : 'active'} ${hasInteracted ? 'interacted' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!hasInteracted ? (
        <button className="start-audio-btn" onClick={startAudio}>
          <span>Enable Sound</span>
        </button>
      ) : (
        <button 
          className="mute-toggle-btn" 
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <HiVolumeOff size={24} /> : <HiVolumeUp size={24} />}
          <div className="sound-waves">
             {!isMuted && [1, 2, 3].map(i => <span key={i} className={`wave wave-${i}`}></span>)}
          </div>
        </button>
      )}
      
      {isHovered && hasInteracted && (
        <div className="audio-tooltip">
          {isMuted ? 'Sound Off' : 'Sound On'}
        </div>
      )}
    </div>
  );
};

export default AudioControls;
