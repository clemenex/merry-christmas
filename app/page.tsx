'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Pause, Play, Camera, X, Snowflake } from 'lucide-react';

const PLACEHOLDER_MUSIC_SRC = "letterbg.mp3"; 
const PAPER_TEXTURE = "bg-stone-50";

interface SnowflakeData {
  left: number;
  duration: number;
  delay: number;
  fontSize: number;
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLetterContent, setShowLetterContent] = useState(false);
  
  const [snowflakes, setSnowflakes] = useState<SnowflakeData[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const flakes: SnowflakeData[] = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5,
      fontSize: 10 + Math.random() * 20
    }));
    setSnowflakes(flakes);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Playback prevented:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const openLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {
      });
      setIsPlaying(true);
    }

    setTimeout(() => {
      setShowLetterContent(true);
    }, 800);
  };

  const closeLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLetterContent(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-900 to-red-950 flex flex-col items-center justify-center overflow-hidden relative font-serif text-slate-800">
      
      {/* --- Global Styles for Animations --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-handwriting { font-family: 'Great Vibes', cursive; }
        .font-serif-display { font-family: 'Playfair Display', serif; }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(153, 27, 27, 0.2); /* red-800 with low opacity */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(153, 27, 27, 0.4);
        }

        @keyframes snowfall {
          0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
        }
        .snowflake {
          position: absolute;
          top: -10px;
          color: white;
          opacity: 0.8;
          animation: snowfall linear infinite;
        }
        
        .envelope-perspective {
          perspective: 1000px;
        }
        .flap {
          transform-origin: top;
          transition: transform 0.6s ease-in-out, z-index 0.6s;
        }
        .flap.open {
          transform: rotateX(180deg);
          z-index: 0;
        }
        .letter-card {
          transition: transform 0.8s ease-in-out, opacity 0.5s;
        }
        .letter-card.open {
          transform: translateY(-60px);
          z-index: 20;
        }
      `}</style>

      {/* --- Background Snow Effects --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {snowflakes.map((flake, i) => (
          <div 
            key={i}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              fontSize: `${flake.fontSize}px`
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* --- Music Player Control --- */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleMusic}
          className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg"
        >
          {isPlaying ? <Pause size={20} /> : <Music size={20} />}
        </button>
        <audio ref={audioRef} src={PLACEHOLDER_MUSIC_SRC} loop />
      </div>

      {/* --- Main Content Area --- */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-4">
        
        {/* Title (Only visible when closed) */}
        <h1 
          className={`text-4xl md:text-5xl text-yellow-100 font-handwriting mb-12 text-center drop-shadow-lg transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        >
          To  My  Dearest,  Fiancée
        </h1>

        {/* --- The Envelope System --- */}
        <div className={`relative w-72 h-48 cursor-pointer transition-transform duration-700 ${isOpen ? 'translate-y-32 scale-110' : 'hover:scale-105'}`} onClick={openLetter}>
          
          {/* Back of Envelope */}
          <div className="absolute inset-0 bg-red-700 rounded-lg shadow-2xl border-2 border-red-800"></div>

          {/* The Letter Inside (Initial State) */}
          <div className={`absolute inset-x-2 top-2 bottom-2 bg-stone-100 shadow-md rounded transition-all duration-700 ${isOpen ? '-translate-y-24 h-64' : 'h-44'}`}>
            <div className="p-4 opacity-50 text-xs">
              <div className="w-full h-2 bg-stone-200 mb-2 rounded"></div>
              <div className="w-2/3 h-2 bg-stone-200 mb-2 rounded"></div>
              <div className="w-3/4 h-2 bg-stone-200 rounded"></div>
            </div>
          </div>

          {/* Front Left Fold */}
          <div className="absolute inset-0 z-10 overflow-hidden rounded-lg pointer-events-none">
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[144px] border-b-[96px] border-l-transparent border-b-red-600/90 border-r-transparent shadow-lg"></div>
            <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[144px] border-b-[96px] border-r-transparent border-b-red-600/90 border-l-transparent shadow-lg"></div>
          </div>

          {/* Top Flap (The animation key) */}
          <div className={`absolute top-0 left-0 w-full z-20 envelope-perspective origin-top transition-transform duration-700 ${isOpen ? 'rotate-x-180 -z-10' : ''}`} style={{ transformStyle: 'preserve-3d', transformOrigin: 'top' }}>
             <div className={`relative w-0 h-0 border-l-[144px] border-t-[100px] border-r-[144px] border-l-transparent border-t-red-800 border-r-transparent origin-top transition-transform duration-700 ${isOpen ? 'rotate-[X] 180deg' : ''}`}>
                {/* Seal */}
                {!isOpen && (
                  <div className="absolute -top-[60px] -left-[20px] bg-yellow-600 w-10 h-10 rounded-full shadow-lg flex items-center justify-center border-2 border-yellow-400">
                    <Heart size={16} className="text-yellow-100 fill-yellow-100" />
                  </div>
                )}
             </div>
          </div>
        </div>

      </main>

      {/* --- The Expanded Love Letter Modal --- */}
      {/* This overlay appears after the envelope opens */}
      {showLetterContent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
          onClick={closeLetter}
        >
          <div 
            className="relative bg-stone-50 w-full max-w-lg p-8 md:p-12 shadow-2xl rounded-sm transform transition-all animate-in zoom-in-95 duration-500 rotate-1 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            
            {/* Close Button */}
            <button 
              onClick={closeLetter}
              className="absolute top-4 right-4 text-stone-400 hover:text-red-800 transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* Letter Content */}
            <div className="relative flex flex-col items-center text-center space-y-6 w-full">
              
              {/* Photo Placeholder */}
              <div className="w-full h-64 shrink-0 bg-stone-200 border-8 border-white shadow-md rotate-[-2deg] flex items-center justify-center overflow-hidden group relative">
                <img src="us.jpg" alt="Us" className="w-full h-full object-cover"/>
              </div>

              {/* Text Content */}
              <div className="space-y-4 w-full px-2">
                <h2 className="text-3xl md:text-4xl text-red-900 font-handwriting">My Dearest, Fiancée</h2>
                <p className="font-serif-display text-stone-700 leading-relaxed text-sm">
                  Merry Christmas! <br/><br/>
                  We may be miles apart right now, but I hope this still reaches you with all the feelings I packed in it.
                  Gusto ko sana magbigay ng something na hindi mawawala. Something that stays there, na satin lang.
                  So I made this! Hahaha, I hope you liked it?
                  I'm thankful that we met, mahal. That I have a partner like you. Someone that pushes
                  me to be a better version of myself. Just know that I'm constantly doing so, para sa'yo. Para satin.
                  I wanted to make this to tell you how much you mean to me. You are the best gift I could ever ask for. I love you so much!!
                </p>
                <p className="font-handwriting text-2xl text-red-800 pt-4">
                  Your Fiancé,<br/>
                  Peter
                </p>
              </div>

              {/* Decorative Footer */}
              <div className="pt-6 text-yellow-600/50 shrink-0">
                <Snowflake size={24} />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer / Credits */}
      <div className="absolute bottom-4 text-red-200/40 text-xs font-sans">
        Made with Love
      </div>

    </div>
  );
}