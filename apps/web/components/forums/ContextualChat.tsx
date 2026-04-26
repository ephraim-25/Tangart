'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
}

interface ContextualChatProps {
  chapterId: string;
  currentUserId: string;
  currentUserName: string;
}

export function ContextualChat({ chapterId, currentUserId, currentUserName }: ContextualChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Post[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, URL should be from env
    const newSocket = io('http://localhost:3001/forums');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinChapter', { chapterId });
    });

    newSocket.on('threadHistory', (history: Post[]) => {
      setMessages(history);
    });

    newSocket.on('newMessage', (post: Post) => {
      setMessages((prev) => [...prev, post]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [chapterId]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit('sendMessage', {
      chapterId,
      content: input,
      authorId: currentUserId
    });
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] max-w-md w-full bg-[#0A0A0A] border border-[#333] rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-[#333] bg-[#111]">
        <h3 className="text-[#D4AF37] font-serif tracking-widest text-sm uppercase">Discussion du Chapitre</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.author?.id === currentUserId;
          const isTeacher = msg.author?.role === 'TEACHER' || msg.author?.role === 'ADMIN';
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className={`text-xs mb-1 ${isTeacher ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                {msg.author?.name || 'Utilisateur'} {isTeacher && '✦'}
              </span>
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm
                  ${isMe 
                    ? 'bg-[#222] text-white rounded-br-none border border-[#333]' 
                    : isTeacher 
                      ? 'bg-gradient-to-br from-[#1A1813] to-[#2B2310] text-[#E8DCC4] border border-[#D4AF37]/30 rounded-bl-none'
                      : 'bg-[#111] text-gray-200 border border-[#222] rounded-bl-none'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-[#111] border-t border-[#333] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Poser une question..."
          className="flex-1 bg-[#222] border border-[#444] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          className="bg-[#D4AF37] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2D675] disabled:opacity-50 disabled:hover:bg-[#D4AF37] transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
