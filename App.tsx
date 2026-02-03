
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppRoute } from './types';
import { BackgroundDecorations } from './components/Decorations';

const App: React.FC = () => {
  // Track the raw hash state to trigger memo re-calculations
  const [hash, setHash] = useState(window.location.hash);
  
  // Creation form states
  const [formRecipient, setFormRecipient] = useState('');
  const [formProposer, setFormProposer] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Interaction state
  const [isNoButtonMoving, setIsNoButtonMoving] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ top: 0, left: 0 });

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /**
   * Derive the current route and proposal data directly from the hash.
   * This is the "Single Source of Truth".
   */
  const routeData = useMemo(() => {
    const hashContent = hash.replace(/^#/, '');
    const [pathPart, queryPart] = hashContent.split('?');
    const params = new URLSearchParams(queryPart || '');
    
    const path = (pathPart || '').replace(/^\/+|\/+$/g, '').toLowerCase();
    
    // URLSearchParams.get already handles basic decoding
    return {
      route: path === 'proposal' ? AppRoute.PROPOSAL : path === 'celebrate' ? AppRoute.CELEBRATE : AppRoute.CREATE,
      recipient: params.get('n') || '',
      proposer: params.get('p') || '',
      message: params.get('m') || ''
    };
  }, [hash]);

  const generateRomanticMessage = async () => {
    if (!formRecipient) {
      alert("Please enter their name first!");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a very short (max 12 words), poetic proposal line for someone named ${formRecipient}. Be sweet and romantic.`,
      });
      setFormMessage(response.text?.trim() || "Every beat of my heart belongs to you, now and forever.");
    } catch (error) {
      setFormMessage("You are the best thing that ever happened to me. Will you be mine?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    // Explicitly set parameters; URLSearchParams handles encoding
    params.set('n', formRecipient);
    params.set('p', formProposer);
    params.set('m', formMessage || "Will you be mine forever?");
    
    const baseUrl = window.location.origin + window.location.pathname;
    const separator = baseUrl.endsWith('/') ? '' : '/';
    const finalUrl = `${baseUrl}${separator}#/proposal?${params.toString()}`;
    
    setShareLink(finalUrl);
  };

  const handleNoHover = () => {
    const newTop = Math.random() * 70 + 15;
    const newLeft = Math.random() * 70 + 15;
    setNoButtonPos({ top: newTop, left: newLeft });
    setIsNoButtonMoving(true);
  };

  const handleYes = () => {
    const params = new URLSearchParams();
    params.set('n', routeData.recipient);
    params.set('p', routeData.proposer);
    window.location.hash = `/celebrate?${params.toString()}`;
  };

  const copyToClipboard = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied! ❤️ Share this with your love.');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden selection:bg-rose-100">
      <BackgroundDecorations />

      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_25px_70px_rgba(255,100,150,0.3)] p-8 border border-white relative overflow-hidden transition-all duration-500">
        
        {/* VIEW 1: CREATE */}
        {routeData.route === AppRoute.CREATE && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-6xl font-romantic text-rose-600 drop-shadow-sm">EverAfter</h1>
              <p className="text-slate-500 font-medium italic">Create a proposal they'll never forget</p>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-500 uppercase tracking-widest ml-1">Their Name</label>
                <input
                  required
                  type="text"
                  placeholder="Who are you proposing to?"
                  value={formRecipient}
                  onChange={(e) => setFormRecipient(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-200/50 transition-all text-slate-900 placeholder:text-slate-400 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-500 uppercase tracking-widest ml-1">Your Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={formProposer}
                  onChange={(e) => setFormProposer(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-200/50 transition-all text-slate-900 placeholder:text-slate-400 font-semibold"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-rose-500 uppercase tracking-widest">A Heartfelt Message</label>
                  <button type="button" onClick={generateRomanticMessage} disabled={isGenerating || !formRecipient} className="text-xs text-rose-600 font-bold underline hover:text-rose-800 transition-colors">
                    {isGenerating ? 'Drafting...' : '✨ AI Assist'}
                  </button>
                </div>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Write something sweet..."
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-200/50 h-28 resize-none text-slate-900 placeholder:text-slate-400 font-semibold leading-relaxed"
                />
              </div>

              {!shareLink ? (
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Create My Proposal ❤️
                </button>
              ) : (
                <div className="space-y-4 animate-in zoom-in">
                  <div className="p-4 bg-rose-50 rounded-2xl border-2 border-dashed border-rose-200">
                    <p className="text-[10px] font-black text-rose-600 uppercase text-center mb-3 tracking-tighter">Your Secret Link is Ready!</p>
                    <div className="flex gap-2">
                      <input readOnly value={shareLink} className="flex-1 bg-white p-3 text-[10px] font-mono rounded-xl border border-rose-100 text-slate-700 outline-none" />
                      <button type="button" onClick={copyToClipboard} className="bg-rose-500 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors shadow-sm">Copy</button>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setShareLink(''); window.location.hash = ''; }} className="w-full text-slate-400 text-xs font-bold uppercase hover:text-rose-500 transition-colors">Start Over</button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* VIEW 2: PROPOSAL */}
        {routeData.route === AppRoute.PROPOSAL && (
          <div className="text-center space-y-12 py-8 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-4">
              <span className="text-rose-500 font-romantic text-3xl">To my dearest,</span>
              <h2 className="text-6xl font-serif text-slate-900 font-black tracking-tight">{routeData.recipient || 'My Love'}</h2>
            </div>
            
            <div className="min-h-[100px] flex items-center justify-center">
              <p className="text-2xl text-slate-800 font-serif italic leading-relaxed px-6">
                "{routeData.message || 'Will you make me the happiest person and stay by my side forever?'}"
              </p>
            </div>
            
            <div className="text-rose-600 font-romantic text-4xl">- {routeData.proposer || 'Your Forever'}</div>

            <div className="space-y-10 pt-4">
              <p className="text-4xl font-romantic text-rose-700 font-bold drop-shadow-sm">Will you be mine forever?</p>
              
              <div className="flex items-center justify-center gap-8 h-24">
                <button 
                  onClick={handleYes} 
                  className="px-14 py-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-3xl font-bold rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-20 ring-8 ring-rose-100"
                >
                  YES! 💖
                </button>

                <button
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  style={isNoButtonMoving ? { position: 'fixed', top: `${noButtonPos.top}%`, left: `${noButtonPos.left}%`, zIndex: 100 } : {}}
                  className={`px-10 py-4 bg-slate-100 text-slate-400 text-xl font-bold rounded-full transition-all duration-75 ${isNoButtonMoving ? 'shadow-2xl border-4 border-white' : ''}`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CELEBRATE */}
        {routeData.route === AppRoute.CELEBRATE && (
          <div className="text-center space-y-10 py-12 animate-in zoom-in duration-700">
             <div className="text-8xl animate-bounce drop-shadow-lg">💍</div>
             <div className="space-y-4">
               <h2 className="text-6xl font-romantic text-rose-600 font-bold">It's a YES!</h2>
               <p className="text-slate-600 text-2xl font-serif italic">The start of a beautiful journey together.</p>
             </div>
             
             <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 shadow-inner">
                <p className="text-slate-500 text-sm italic mb-6">Send a screenshot to <strong>{routeData.proposer}</strong> to let them know! ❤️</p>
                <button onClick={() => window.location.hash = ''} className="text-rose-500 font-bold text-xs uppercase tracking-[0.3em] hover:text-rose-700 transition-colors">Create another memory</button>
             </div>
          </div>
        )}

      </div>
      <footer className="mt-8 text-rose-400/50 text-[10px] uppercase font-bold tracking-[0.5em]">EverAfter • Made with love</footer>
    </div>
  );
};

export default App;
