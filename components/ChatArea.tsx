
import React, { useEffect, useRef, useState } from 'react';
import { QontakRoom, QontakMessage } from '../types';
import { MoreVertical, Search, Paperclip, Smile, Send, Check, CheckCheck, X, ArrowLeft } from 'lucide-react';

interface ChatAreaProps {
  room: QontakRoom | null;
  messages: QontakMessage[];
  onSendMessage: (text: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ room, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !isSearching) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSearching]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    setChatSearchQuery('');
  };

  const filteredMessages = chatSearchQuery.trim()
    ? messages.filter((msg) =>
        msg.body.toLowerCase().includes(chatSearchQuery.toLowerCase())
      )
    : messages;

  const renderStatus = (status?: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
      case 'sent':
      default:
        return <Check className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-64 h-64 opacity-20 bg-gray-300 rounded-full flex items-center justify-center mb-6">
          <Send className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-light text-gray-600 mb-2">Qontak Web CMS</h2>
        <p className="text-gray-500 text-center max-w-sm">
          Select a chat to start messaging with your customers through WhatsApp Business API.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#e5ddd5] relative">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 z-10 h-16">
        {isSearching ? (
          <div className="flex items-center w-full gap-3 animate-in slide-in-from-right-2 duration-200">
            <button 
              onClick={toggleSearch}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                autoFocus
                type="text"
                placeholder="Search messages..."
                className="w-full bg-gray-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
              />
              {chatSearchQuery && (
                <button 
                  onClick={() => setChatSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                {room.avatar_url ? (
                  <img src={room.avatar_url} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 font-bold uppercase">{room.name[0]}</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">{room.name}</h3>
                <p className="text-xs text-gray-500">{room.phone_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <button 
                onClick={toggleSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 z-10"
      >
        {isSearching && chatSearchQuery && (
          <div className="text-center py-2">
            <span className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-xs text-gray-500 shadow-sm">
              Found {filteredMessages.length} results for "{chatSearchQuery}"
            </span>
          </div>
        )}
        
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => {
            const isAgent = msg.sender_type === 'agent';
            return (
              <div 
                key={msg.id}
                className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-2.5 shadow-sm relative ${
                    isAgent ? 'bg-[#dcf8c6] text-gray-800' : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-sm mb-1 leading-normal whitespace-pre-wrap">
                    {msg.body}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isAgent && (
                      <span className="flex items-center">
                        {renderStatus(msg.status)}
                      </span>
                    )}
                  </div>
                  
                  {/* Bubble Tip */}
                  <div className={`absolute top-0 ${isAgent ? '-right-1.5 border-l-[#dcf8c6]' : '-left-1.5 border-r-white'} border-y-[6px] border-y-transparent border-x-[8px]`}></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">No messages found</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-3 bg-white border-t border-gray-200 z-10 transition-all ${isSearching ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        <div className="flex items-center gap-3">
          <Smile className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 flex-shrink-0" />
          <Paperclip className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 flex-shrink-0" />
          
          <div className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-1.5">
            <textarea 
              disabled={isSearching}
              placeholder={isSearching ? "Exit search to send messages" : "Type a message"}
              className="w-full bg-transparent border-none outline-none text-sm resize-none py-1 max-h-32"
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isSearching}
            className={`p-2 rounded-full flex-shrink-0 transition-colors ${
              inputValue.trim() && !isSearching ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
