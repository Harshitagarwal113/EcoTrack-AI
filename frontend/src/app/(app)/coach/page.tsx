"use client";

import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { useRef, useEffect, useState } from 'react';

export default function CoachPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10 pb-8 h-[calc(100vh-6rem)]">
      <div className="flex flex-col stack-sm">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">AI Coach</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Powered by Google Gemini 3.1 Flash Lite</p>
      </div>

      <div className="flex-1 liquid-glass-panel rounded-[24px] overflow-hidden flex flex-col relative shadow-[0_20px_40px_rgba(16,185,129,0.05)]">
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 opacity-80">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                <span className="material-symbols-outlined text-[32px]">psychology</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">I'm your Sustainability Coach</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                I have real-time access to your carbon footprint. Ask me to analyze your progress, suggest weekly goals, or recommend sustainable habits!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button onClick={() => sendMessage({ text: "Analyze my carbon footprint this month." })} className="bg-white/50 border border-white/50 px-4 py-2 rounded-full font-label-sm text-on-surface-variant hover:text-primary transition-colors">Analyze footprint</button>
                <button onClick={() => sendMessage({ text: "Generate 3 weekly sustainability goals." })} className="bg-white/50 border border-white/50 px-4 py-2 rounded-full font-label-sm text-on-surface-variant hover:text-primary transition-colors">Generate goals</button>
              </div>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-sm shadow-md' 
                  : 'ai-glass-glass border border-white/40 text-on-surface rounded-tl-sm shadow-sm'
              }`}>
                {m.role !== 'user' && (
                  <div className="flex items-center gap-2 mb-2 text-primary font-semibold font-label-sm">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    Gemini Coach
                  </div>
                )}
                <div className={`font-body-md leading-relaxed prose prose-sm max-w-none ${m.role === 'user' ? 'text-white' : 'prose-headings:text-primary prose-a:text-primary'}`}>
                  {m.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return <ReactMarkdown key={i}>{part.text}</ReactMarkdown>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="ai-glass-glass border border-white/40 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/30">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-white/70 rounded-full pl-6 pr-2 py-2 border border-white/60 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input 
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your footprint or request a goal..." 
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none font-body-md text-on-surface placeholder:text-on-surface-variant/60 py-2"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined text-[20px] ml-1">send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
