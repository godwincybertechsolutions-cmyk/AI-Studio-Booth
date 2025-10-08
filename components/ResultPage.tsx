import React, { useMemo } from 'react';
import AudioPlayer from './AudioPlayer';
import { DownloadIcon, ReplayIcon } from './icons';

interface ResultPageProps {
  originalUrl: string;
  processedUrl: string;
  fileName: string;
  onStartOver: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ 
  originalUrl, 
  processedUrl, 
  fileName, 
  onStartOver 
}) => {
  const displayFileName = useMemo(() => 
    fileName.length > 60 ? `${fileName.substring(0, 57)}...` : fileName,
    [fileName]
  );

  const downloadFileName = useMemo(() => 
    `enhanced-${fileName}`,
    [fileName]
  );

  return (
    <div className="w-full max-w-3xl flex flex-col items-center p-8 bg-gray-800/50 backdrop-blur-md rounded-lg shadow-2xl shadow-black/30">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
        Enhancement Complete!
      </h2>
      <p 
        className="text-gray-400 mb-8 w-full px-4 text-center truncate" 
        title={fileName}
      >
        {displayFileName}
      </p>
     
      <div className="w-full grid md:grid-cols-2 gap-8 mb-8">
        <AudioPlayer 
          title="Original Audio" 
          src={originalUrl} 
        />
        <AudioPlayer 
          title="Enhanced Audio" 
          src={processedUrl} 
          accentColor="purple" 
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <a
          href={processedUrl}
          download={downloadFileName}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download</span>
        </a>
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
        >
          <ReplayIcon className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ResultPage);