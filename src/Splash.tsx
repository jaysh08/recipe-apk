// Simple Splash Screen Component
import { useState, useEffect } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    // Exit after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      {/* Animated Pot SVG */}
      <div style={{
        marginBottom: '30px',
        animation: 'float 2s ease-in-out infinite'
      }}>
        <svg width="180" height="180" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 30px rgba(255,179,102,0.5))' }}>
          <style>{`
            @keyframes steam-rise {
              0% { transform: translateY(0); opacity: 0.8; }
              100% { transform: translateY(-25px); opacity: 0; }
            }
            @keyframes pot-shake {
              0%, 100% { transform: rotate(-2deg); }
              50% { transform: rotate(2deg); }
            }
            @keyframes glow-pulse {
              0%, 100% { filter: drop-shadow(0 0 10px #FFB366); }
              50% { filter: drop-shadow(0 0 30px #FF8C00); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .steam { animation: steam-rise 2s ease-out infinite; }
            .steam:nth-of-type(2) { animation-delay: 0.5s; }
            .steam:nth-of-type(3) { animation-delay: 1s; }
            .pot { animation: pot-shake 0.5s ease-in-out infinite; transform-origin: 100px 150px; }
            .glow { animation: glow-pulse 2s ease-in-out infinite; }
          `}</style>
          
          {/* Background glow */}
          <circle cx="100" cy="100" r="90" fill="url(#bgGrad)" className="glow" opacity="0.4"/>
          
          {/* Steam */}
          <path className="steam" d="M70 55 Q75 38 70 22" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path className="steam" d="M100 50 Q105 33 100 17" stroke="#FFB366" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path className="steam" d="M130 55 Q135 38 130 22" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" fill="none"/>
          
          {/* Pot */}
          <g className="pot">
            <ellipse cx="100" cy="155" rx="55" ry="15" fill="rgba(0,0,0,0.2)"/>
            <path d="M45 90 C45 135 55 155 100 155 C145 155 155 135 155 90 L155 78 C155 72 150 67 143 67 L57 67 C50 67 45 72 45 78 Z" fill="url(#potGrad)"/>
            <ellipse cx="100" cy="67" rx="55" ry="13" fill="#D2691E"/>
            <ellipse cx="100" cy="67" rx="47" ry="9" fill="#8B4513"/>
            <path d="M28 85 C16 85 10 97 10 106 C10 115 16 125 28 125" stroke="#A0522D" strokeWidth="10" strokeLinecap="round" fill="none"/>
            <path d="M172 85 C184 85 190 97 190 106 C190 115 184 125 172 125" stroke="#A0522D" strokeWidth="10" strokeLinecap="round" fill="none"/>
          </g>
          
          <defs>
            <linearGradient id="potGrad" x1="45" y1="67" x2="155" y2="155">
              <stop offset="0%" stopColor="#CD853F"/>
              <stop offset="50%" stopColor="#8B4513"/>
              <stop offset="100%" stopColor="#5D3A1A"/>
            </linearGradient>
            <radialGradient id="bgGrad">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#FF8C00" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {/* Title */}
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#fff',
        margin: '0 0 8px',
        textAlign: 'center',
        animation: 'fadeIn 0.8s ease-out 0.3s both',
      }}>
        🍳 Recipe <span style={{ color: '#FFB366' }}>Delight</span>
      </h1>
      
      {/* Tagline */}
      <p style={{
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        margin: '0 0 30px',
        animation: 'fadeIn 0.6s ease-out 0.6s both',
      }}>
        Discover • Cook • Share
      </p>
      
      {/* Progress bar */}
      <div style={{
        width: '200px',
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '15px',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FFB366, #FFD700, #FF8C00)',
          borderRadius: '10px',
          transition: 'width 0.1s ease-out',
        }}/>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}