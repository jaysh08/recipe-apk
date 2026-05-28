import { useState, useEffect } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start animations with delays
    const showTitleTimer = setTimeout(() => setShowTitle(true), 800);
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Exit after animation completes
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearTimeout(showTitleTimer);
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isExiting ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Animated Logo Container */}
        <div className="logo-container">
          <svg 
            width="180" 
            height="180" 
            viewBox="0 0 200 200" 
            className="animated-logo"
          >
            <style>{`
              @keyframes steam-rise {
                0% { transform: translateY(0) scale(1); opacity: 0.8; }
                50% { transform: translateY(-12px) scale(1.1); opacity: 0.4; }
                100% { transform: translateY(-25px) scale(0.8); opacity: 0; }
              }
              @keyframes bubble {
                0% { transform: scale(1) translateY(0); opacity: 0.8; }
                50% { transform: scale(1.4) translateY(-5px); opacity: 0.5; }
                100% { transform: scale(0.3) translateY(-15px); opacity: 0; }
              }
              @keyframes pot-shake {
                0%, 100% { transform: rotate(-1.5deg) translateX(0); }
                20% { transform: rotate(1.5deg) translateX(1px); }
                40% { transform: rotate(-1.5deg) translateX(-1px); }
                60% { transform: rotate(1deg) translateX(0.5px); }
                80% { transform: rotate(-1deg) translateX(-0.5px); }
              }
              @keyframes glow-pulse {
                0%, 100% { filter: drop-shadow(0 0 8px #FFB366); }
                50% { filter: drop-shadow(0 0 25px #FF8C00); }
              }
              @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                50% { opacity: 1; transform: scale(1) rotate(180deg); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              @keyframes color-shift {
                0% { fill: #FFB366; }
                33% { fill: #FF8C00; }
                66% { fill: #FFD700; }
                100% { fill: #FFB366; }
              }
              .steam-line {
                animation: steam-rise 2s ease-out infinite;
              }
              .steam-line:nth-of-type(2) { animation-delay: 0.4s; }
              .steam-line:nth-of-type(3) { animation-delay: 0.8s; }
              .bubble-anim {
                animation: bubble 1.8s ease-out infinite;
              }
              .bubble-anim:nth-of-type(2) { animation-delay: 0.6s; }
              .bubble-anim:nth-of-type(3) { animation-delay: 1.2s; }
              .pot-anim {
                animation: pot-shake 0.6s ease-in-out infinite;
                transform-origin: 100px 150px;
              }
              .glow-anim {
                animation: glow-pulse 2s ease-in-out infinite;
              }
              .sparkle-anim {
                animation: sparkle 1.5s ease-in-out infinite;
                transform-origin: center;
              }
              .sparkle-anim:nth-of-type(2) { animation-delay: 0.5s; }
              .sparkle-anim:nth-of-type(3) { animation-delay: 1s; }
              .logo-float {
                animation: float 3s ease-in-out infinite;
              }
              .fire-glow {
                animation: color-shift 2s ease-in-out infinite;
              }
            `}</style>
            
            {/* Background Glow */}
            <circle cx="100" cy="100" r="95" fill="url(#splashBgGradient)" className="glow-anim" opacity="0.4"/>
            
            {/* Steam Lines */}
            <g className="steam-group">
              <path className="steam-line" d="M68 60 Q73 42 68 25" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75"/>
              <path className="steam-line" d="M100 55 Q105 37 100 20" stroke="#FFB366" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75"/>
              <path className="steam-line" d="M132 60 Q137 42 132 25" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75"/>
            </g>
            
            {/* Bubbles */}
            <circle cx="82" cy="68" r="6" fill="#FFD700" className="bubble-anim"/>
            <circle cx="118" cy="62" r="5" fill="#FFA500" className="bubble-anim"/>
            <circle cx="100" cy="72" r="4" fill="#FFB366" className="bubble-anim"/>
            
            {/* Pot with Animation */}
            <g className="logo-float">
              <g className="pot-anim">
                {/* Pot Shadow */}
                <ellipse cx="100" cy="158" rx="58" ry="18" fill="rgba(0,0,0,0.2)"/>
                
                {/* Pot Body */}
                <path d="M42 95 C42 140 54 158 100 158 C146 158 158 140 158 95 L158 82 C158 76 152 70 145 70 L55 70 C48 70 42 76 42 82 Z" fill="url(#splashPotGradient)"/>
                
                {/* Pot Highlight */}
                <path d="M55 90 C55 125 65 145 90 150" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" fill="none"/>
                
                {/* Pot Rim */}
                <ellipse cx="100" cy="70" rx="58" ry="14" fill="#D2691E"/>
                <ellipse cx="100" cy="70" rx="50" ry="10" fill="#8B4513"/>
                <ellipse cx="100" cy="68" rx="45" ry="8" fill="#654321"/>
                
                {/* Handles */}
                <path d="M30 88 C18 88 12 100 12 108 C12 116 18 125 30 125" stroke="#A0522D" strokeWidth="10" strokeLinecap="round" fill="none"/>
                <path d="M170 88 C182 88 188 100 188 108 C188 116 182 125 170 125" stroke="#A0522D" strokeWidth="10" strokeLinecap="round" fill="none"/>
                
                {/* Food Contents */}
                <ellipse cx="100" cy="75" rx="42" ry="8" fill="#FF6B35" className="fire-glow" opacity="0.8"/>
              </g>
            </g>
            
            {/* Decorative Sparkles */}
            <g className="sparkle-anim">
              <path d="M50 45 L54 52 L62 52 L56 57 L59 65 L50 60 L41 65 L44 57 L38 52 L46 52 Z" fill="#FFD700"/>
            </g>
            <g className="sparkle-anim" style={{animationDelay: '0.7s'}}>
              <path d="M150 50 L153 55 L158 55 L154 58 L156 63 L150 60 L144 63 L146 58 L142 55 L147 55 Z" fill="#FFD700"/>
            </g>
            <g className="sparkle-anim" style={{animationDelay: '1.4s'}}>
              <path d="M175 100 L177 103 L180 103 L178 105 L179 108 L175 106 L171 108 L172 105 L170 103 L173 103 Z" fill="#FFB366"/>
            </g>
            
            {/* Gradients */}
            <defs>
              <linearGradient id="splashPotGradient" x1="42" y1="70" x2="158" y2="158">
                <stop offset="0%" stopColor="#CD853F"/>
                <stop offset="40%" stopColor="#8B4513"/>
                <stop offset="100%" stopColor="#5D3A1A"/>
              </linearGradient>
              <radialGradient id="splashBgGradient">
                <stop offset="0%" stopColor="#FFD700"/>
                <stop offset="60%" stopColor="#FF8C00"/>
                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        {/* Title */}
        <h1 className={`splash-title ${showTitle ? 'visible' : ''}`}>
          <span className="title-line">🍳 Recipe</span>
          <span className="title-line accent">Delight</span>
        </h1>
        
        {/* Tagline */}
        <p className={`splash-tagline ${showTitle ? 'visible' : ''}`}>
          Discover. Cook. Share.
        </p>
        
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
        
        {/* Loading dots */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="splash-particles">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}