import React from 'react';
import HomePage from './components/HomePage';
import ProcessingPage from './components/ProcessingPage';
import ResultsPage from './components/ResultsPage';
import CyberNav from './components/CyberNav';
import { AudioProvider } from './contexts/AudioContext';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'processing' | 'results'>('home');
  const [audioFile, setAudioFile] = React.useState<File | null>(null);

  return (
    <AudioProvider>
      <div className="min-h-screen bg-transparent">
        {/* Animated Header */}
        <CyberNav />
        
        {/* Main Content with Cyber Effects */}
        <main className="relative z-10">
          <div className="cyber-panel rounded-lg mx-4 my-4 border-2 border-cyber-border backdrop-blur-sm">
            <div className="p-6">
              {currentPage === 'home' && (
                <HomePage 
                  onAudioReady={(file) => {
                    setAudioFile(file);
                    setCurrentPage('processing');
                  }} 
                />
              )}
              
              {currentPage === 'processing' && audioFile && (
                <ProcessingPage 
                  fileName={audioFile.name}
                  onComplete={() => setCurrentPage('results')}
                />
              )}
              
              {currentPage === 'results' && audioFile && (
                <ResultsPage 
                  originalUrl={URL.createObjectURL(audioFile)}
                  processedUrl="/api/processed-audio"
                  fileName={audioFile.name}
                  onStartOver={() => setCurrentPage('home')}
                />
              )}
            </div>
          </div>
        </main>

        {/* Cyber Footer */}
        <footer className="text-center py-6 font-rajdhani text-cyber-primary opacity-60">
          <div className="animate-pulse-cyber">
            ⚡ CYBER AUDIO ENHANCEMENT SYSTEM v2.0 ⚡
          </div>
        </footer>
      </div>
    </AudioProvider>
  );
}