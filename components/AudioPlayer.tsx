import React, { useState, useRef, useCallback, useMemo } from 'react';
import { PlayIcon, PauseIcon } from './icons';

interface AudioPlayerProps {
  title: string;
  src: string;
  accentColor?: 'purple' | 'cyan';
}

const useAudioPlayer = (src: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const setAudioTime = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    setDuration,
    setCurrentTime,
    setIsPlaying,
    togglePlayPause,
    setAudioTime,
  };
};

const formatTime = (time: number): string => {
  if (!Number.isFinite(time) || time <= 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ProgressBar: React.FC<{
  progress: number;
  accentColor: 'purple' | 'cyan';
  onProgressClick: (percentage: number) => void;
}> = ({ progress, accentColor, onProgressClick }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickPositionX / width));
    
    onProgressClick(percentage);
  }, [onProgressClick]);

  const accentClasses = {
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div
      ref={progressBarRef}
      className="w-full h-2 bg-gray-600 rounded-full cursor-pointer"
      onClick={handleClick}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-200 ${accentClasses[accentColor]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  title, 
  src, 
  accentColor = 'cyan' 
}) => {
  const {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    setDuration,
    setCurrentTime,
    setIsPlaying,
    togglePlayPause,
    setAudioTime,
  } = useAudioPlayer(src);

  const progressPercentage = useMemo(() => 
    duration > 0 ? (currentTime / duration) * 100 : 0,
    [currentTime, duration]
  );

  const handleLoadedData = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }
  }, [setDuration, setCurrentTime]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  }, [setCurrentTime]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleProgressClick = useCallback((percentage: number) => {
    const newTime = percentage * duration;
    setAudioTime(newTime);
  }, [duration, setAudioTime]);

  const buttonClasses = useMemo(() => 
    `p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
      accentColor === 'purple' 
        ? 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500' 
        : 'bg-cyan-600 hover:bg-cyan-700 focus-visible:ring-cyan-500'
    }`,
    [accentColor]
  );

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 w-full">
      <p className="text-sm font-semibold mb-2 text-gray-100">{title}</p>
      <div className="flex items-center gap-4">
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedData={handleLoadedData}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        <button
          onClick={togglePlayPause}
          className={buttonClasses}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6 text-white" />
          ) : (
            <PlayIcon className="w-6 h-6 text-white" />
          )}
        </button>
        <div className="flex-grow flex items-center gap-2">
          <span className="text-xs font-mono w-10 text-right text-gray-300">
            {formatTime(currentTime)}
          </span>
          <ProgressBar
            progress={progressPercentage}
            accentColor={accentColor}
            onProgressClick={handleProgressClick}
          />
          <span className="text-xs font-mono w-10 text-gray-300">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AudioPlayer);