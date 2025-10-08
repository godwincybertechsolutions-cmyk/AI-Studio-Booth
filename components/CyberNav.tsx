import React from 'react';

export default function CyberNav() {
  return (
    <nav className="relative py-6 px-4 border-b border-cyber-border bg-cyber-panel/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo with Animation */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-accent animate-cyber-spin flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-cyber-dark flex items-center justify-center">
              <span className="text-cyber-primary font-bold text-sm">AI</span>
            </div>
          </div>
          <h1 className="font-orbitron text-2xl bg-gradient-to-r from-cyber-primary via-cyber-accent to-cyber-secondary bg-clip-text text-transparent animate-glow">
            CYBER STUDIO
          </h1>
        </div>
        
        {/* Status Display */}
        <div className="flex items-center space-x-4 font-rajdhani">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse-cyber"></div>
            <span className="text-cyber-primary text-sm">SYSTEM: ONLINE</span>
          </div>
          <div className="text-cyber-secondary text-sm">
            READY FOR ENHANCEMENT
          </div>
        </div>
      </div>
      
      {/* Scanning Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-scan"></div>
    </nav>
  );
}