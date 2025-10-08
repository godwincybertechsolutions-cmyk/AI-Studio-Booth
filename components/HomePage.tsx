import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, MicrophoneIcon } from './icons';

interface HomePageProps {
  onAudioReady: (file: File) => void;
}

type TabType = 'upload' | 'record';

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
      active 
        ? 'bg-gray-800 text-white' 
        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70'
    }`}
  >
    {children}
  </button>
);

const useFileHandler = (onAudioReady: (file: File) => void) => {
  const handleFile = useCallback((file: File | null | undefined) => {
    if (file?.type.startsWith('audio/')) {
      onAudioReady(file);
    } else {
      alert('Please select a valid audio file.');
    }
  }, [onAudioReady]);

  return { handleFile };
};

const Uploader: React.FC<{ onAudioReady: (file: File) => void }> = ({ onAudioReady }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFile } = useFileHandler(onAudioReady);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(true);
  }, [handleDrag]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
  }, [handleDrag]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, [handleDrag, handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // Reset input to allow selecting the same file again
    e.target.value = '';
  }, [handleFile]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const dragClasses = `relative border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 ${
    isDragging 
      ? 'border-purple-500 bg-gray-700/50' 
      : 'border-gray-600 hover:border-gray-500'
  }`;

  return (
    <div
      className={dragClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-400">Drag & drop your audio file here</p>
        <p className="text-sm text-gray-500">or</p>
        <button
          onClick={handleButtonClick}
          className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

const useAudioRecorder = (onAudioReady: (file: File) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { 
          type: 'audio/wav' 
        });
        onAudioReady(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  }, [onAudioReady]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
  };
};

const Recorder: React.FC<{ onAudioReady: (file: File) => void }> = ({ onAudioReady }) => {
  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder(onAudioReady);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  const handleRecordClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const buttonClasses = `relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
    isRecording 
      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
      : 'bg-purple-600 hover:bg-purple-700'
  }`;

  return (
    <div className="flex flex-col items-center justify-center p-10 gap-6">
      <button
        onClick={handleRecordClick}
        className={buttonClasses}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <MicrophoneIcon className="w-10 h-10 text-white" />
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-500/50 animate-ping" />
        )}
      </button>
      <p className="text-2xl font-mono text-gray-100">{formatTime(recordingTime)}</p>
      <p className="text-sm text-gray-400">
        {isRecording ? 'Click to Stop Recording' : 'Click to Start Recording'}
      </p>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onAudioReady }) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-2xl shadow-black/30 overflow-hidden">
        <div className="flex">
          <TabButton 
            active={activeTab === 'upload'} 
            onClick={() => handleTabChange('upload')}
          >
            Upload File
          </TabButton>
          <TabButton 
            active={activeTab === 'record'} 
            onClick={() => handleTabChange('record')}
          >
            Record Audio
          </TabButton>
        </div>
        <div className="p-4">
          {activeTab === 'upload' ? (
            <Uploader onAudioReady={onAudioReady} />
          ) : (
            <Recorder onAudioReady={onAudioReady} />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomePage);