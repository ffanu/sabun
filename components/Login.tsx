
import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const SoapBubble = ({ size, left, top, delay, duration, colorIndex }: { size: number, left: string, top: string, delay: string, duration: string, colorIndex: number }) => {
  const colors = [
    'rgba(255, 182, 193, 0.4)', 
    'rgba(173, 216, 230, 0.4)', 
    'rgba(221, 160, 221, 0.4)', 
    'rgba(144, 238, 144, 0.4)', 
    'rgba(255, 255, 224, 0.4)', 
  ];

  return (
    <div 
      className="absolute rounded-full pointer-events-none soap-bubble overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        top,
        animationDelay: delay,
        animationDuration: duration,
        boxShadow: `inset -5px -5px 15px rgba(255, 255, 255, 0.3), inset 5px 5px 15px ${colors[colorIndex % colors.length]}`,
        border: '1px solid rgba(255, 255, 255, 0.4)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-60"></div>
      <div className="absolute top-[10%] left-[15%] rounded-full bg-white/60 blur-[1px]" style={{ width: '25%', height: '25%' }}></div>
      <div className="absolute bottom-[20%] right-[20%] rounded-full bg-white/20 blur-[2px]" style={{ width: '10%', height: '10%' }}></div>
      <div className="absolute inset-0 rounded-full border-[2px] border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: Math.random() * 70 + 20,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100 + 10}%`,
      delay: `${Math.random() * -20}s`,
      duration: `${Math.random() * 10 + 15}s`,
      colorIndex: i
    }));
    setBubbles(newBubbles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#f5f3ff]">
      
      {/* Soap Bubble Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {bubbles.map((b) => (
          <SoapBubble key={b.id} {...b} />
        ))}
      </div>

      {/* SpongeBob (Right Side) */}
      <div className="absolute bottom-0 right-0 md:right-10 z-20 pointer-events-none">
        <div className="relative w-48 h-48 md:w-64 md:h-64 spongebob-container">
          {/* SpongeBob Body */}
          <img 
            src="https://pngimg.com/uploads/spongebob/spongebob_PNG11.png" 
            alt="SpongeBob" 
            className="w-full h-full object-contain spongebob-char"
          />
          
          {/* Bubble Wand Animation */}
          <div className="absolute top-[30%] left-[-20px] w-12 h-24 bubble-wand-container">
            <div className="w-1.5 h-full bg-[#8B4513] mx-auto rounded-full"></div>
            <div className="absolute top-0 left-[-6px] w-6 h-6 rounded-full border-4 border-[#FFD700] bg-white/20 backdrop-blur-sm shadow-[0_0_10px_rgba(255,215,0,0.5)]">
               {/* Stream of tiny bubbles from wand */}
               <div className="absolute top-[-20px] left-0 wand-bubbles">
                  <div className="tiny-bubble b1"></div>
                  <div className="tiny-bubble b2"></div>
                  <div className="tiny-bubble b3"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(30px, -50px) rotate(10deg) scale(1.05); }
          66% { transform: translate(-20px, -100px) rotate(-10deg) scale(0.95); }
          100% { transform: translate(10px, -200px) rotate(5deg) scale(1); }
        }

        @keyframes wobble {
          0%, 100% { border-radius: 50% 50% 50% 50%; }
          25% { border-radius: 45% 55% 45% 55%; }
          50% { border-radius: 55% 45% 55% 45%; }
          75% { border-radius: 48% 52% 48% 52%; }
        }

        .soap-bubble {
          animation: drift linear infinite, wobble ease-in-out infinite alternate;
          animation-duration: inherit;
          backdrop-filter: blur(0.5px);
          will-change: transform;
        }

        @keyframes spongebob-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        .spongebob-char {
          animation: spongebob-float 3s ease-in-out infinite;
        }

        @keyframes wand-move {
          0%, 100% { transform: rotate(-20deg) translateX(0); }
          50% { transform: rotate(10deg) translateX(-10px); }
        }

        .bubble-wand-container {
          animation: wand-move 2s ease-in-out infinite;
          transform-origin: bottom center;
        }

        @keyframes wand-bubbles-emit {
          0% { opacity: 0; transform: translateY(0) scale(0.2); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
        }

        .tiny-bubble {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid white;
          animation: wand-bubbles-emit 1.5s infinite;
        }
        .b1 { left: 0; animation-delay: 0s; }
        .b2 { left: 10px; animation-delay: 0.5s; }
        .b3 { left: -5px; animation-delay: 1s; }

        @keyframes textGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5)); }
        }

        .branding-bubble {
          animation: float 4s ease-in-out infinite, textGlow 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); filter: blur(10px); }
          70% { transform: scale(1.1); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
      `}</style>

      {/* Login Card Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[340px] px-6">
        {/* Harmonika ID Branding */}
        <div className="mb-12 text-center branding-bubble">
          <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
            <div className="absolute inset-[-15px] rounded-full border border-white/60 bg-white/10 backdrop-blur-[4px] shadow-[inset_0_0_30px_rgba(255,255,255,0.9),0_0_20px_rgba(255,255,255,0.4)] soap-bubble"></div>
            <div className="relative z-10 w-20 h-20 rounded-[24%] bg-white shadow-2xl flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="relative">
            <h1 
              className="text-[42px] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-600 tracking-tight leading-tight"
              style={{ animation: 'popIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
            >
              Harmonika ID
            </h1>
            <p 
              className="text-[16px] text-indigo-900/60 mt-2 font-bold tracking-wide uppercase"
              style={{ animation: 'popIn 1.2s ease-out 0.2s forwards', opacity: 0 }}
            >
              Professional Agent Portal
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="w-full p-1 bg-white/30 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <form onSubmit={handleSubmit} className="w-full bg-white/90 p-8 rounded-[2.3rem] space-y-5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Agent Identity</label>
              <input
                required
                type="email"
                placeholder="Email or Agent ID"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 text-gray-800 transition-all placeholder:text-gray-300 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={!email || isLoading}
                className="group relative flex items-center justify-center w-full py-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed overflow-hidden shadow-xl shadow-blue-500/20 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2 font-bold tracking-tight">
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Action Links */}
        <div className="mt-12 flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
            <div className="flex gap-6 text-[14px] text-blue-700 font-bold">
              <button className="hover:text-blue-500 transition-colors">Support</button>
              <div className="w-px h-4 bg-gray-300 self-center"></div>
              <button className="hover:text-blue-500 transition-colors">Security</button>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1 z-30">
        <span className="text-[12px] text-indigo-900/40 font-black tracking-[0.2em] uppercase">Harmonika Omnichannel</span>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default Login;
