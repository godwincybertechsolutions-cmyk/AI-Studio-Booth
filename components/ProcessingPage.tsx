import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProgressBar from './ProgressBar';

interface ProcessingPageProps {
  fileName: string;
  onComplete: () => void;
}

interface ProcessingStep {
  progress: number;
  text: string;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { progress: 0, text: 'Initializing AI engine...' },
  { progress: 15, text: 'Analyzing audio frequencies...' },
  { progress: 30, text: 'Detecting and isolating noise...' },
  { progress: 50, text: 'Applying advanced noise reduction...' },
  { progress: 70, text: 'Enhancing vocal clarity...' },
  { progress: 85, text: 'Mastering and balancing audio...' },
  { progress: 95, text: 'Finalizing your enhanced audio...' },
  { progress: 100, text: 'Processing complete!' },
];

const useProcessingSimulation = (onComplete: () => void) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 80); // ~8 seconds total processing time simulation

    return () => clearInterval(interval);
  }, [onComplete]);

  return progress;
};

const useStatusText = (progress: number) => {
  const [statusText, setStatusText] = useState(PROCESSING_STEPS[0].text);

  useEffect(() => {
    const currentStep = PROCESSING_STEPS
      .slice()
      .reverse()
      .find(step => progress >= step.progress);
    
    if (currentStep) {
      setStatusText(currentStep.text);
    }
  }, [progress]);

  return statusText;
};

export const ProcessingPage: React.FC<ProcessingPageProps> = ({ 
  fileName, 
  onComplete 
}) => {
  const progress = useProcessingSimulation(onComplete);
  const statusText = useStatusText(progress);

  const displayFileName = useMemo(() => 
    fileName.length > 50 ? `${fileName.substring(0, 47)}...` : fileName,
    [fileName]
  );

  return (
    <div className="w-full max-w-xl text-center flex flex-col items-center justify-center p-8 bg-gray-800/50 backdrop-blur-md rounded-lg shadow-2xl shadow-black/30">
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        Enhancing Your Audio
      </h2>
      <p 
        className="text-gray-400 mb-8 w-full px-4 truncate" 
        title={fileName}
      >
        {displayFileName}
      </p>
      <ProgressBar progress={progress} />
      <p className="mt-6 text-purple-300 font-medium min-h-[2em]">
        {statusText}
      </p>
    </div>
  );
};

export default React.memo(ProcessingPage);