import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { getFreights } from '../services/storage';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'model' | 'user';
  text: string;
}

export const AIAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o FreteBot. Posso ajudar a calcular custos, analisar rotas ou tirar dúvidas sobre seus fretes. O que manda hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const freights = getFreights();
      // Prepare history for API (excluding the last user message we just added visually, as we pass it as 'newMessage')
      const apiHistory = messages.map(m => ({ role: m.role, text: m.text }));
      
      const response = await chatWithAssistant(apiHistory, userMsg, freights);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema de conexão. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      <div className="bg-white p-4 shadow-sm border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
            <div className="bg-brand-100 p-2 rounded-full">
                <Bot className="text-brand-600" size={24} />
            </div>
            <div>
                <h1 className="font-bold text-gray-900">FreteBot</h1>
                <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                </p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm">
                    <div className="flex gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-100 border-0 rounded-xl px-4 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-brand-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-brand-700 transition-colors"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};