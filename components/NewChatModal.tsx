
import React, { useState, useEffect } from 'react';
import { X, User, Phone, MessageSquare, Send, Loader2 } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onStartChat: (phone: string, name: string, message: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, isLoading, onClose, onStartChat }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('Halo, ada yang bisa saya bantu?');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setName('');
      setMessage('Halo, ada yang bisa saya bantu?');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && name && message && !isLoading) {
      // Normalize phone number (remove +, spaces, etc if user adds them)
      const cleanPhone = phone.replace(/\D/g, '');
      onStartChat(cleanPhone, name, message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Mulai Chat Baru</h2>
              <p className="text-xs text-gray-400">Hubungkan pelanggan ke WhatsApp</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nama Kontak</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                required
                disabled={isLoading}
                type="text"
                placeholder="Contoh: Budi Santoso"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all disabled:opacity-60"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <span className="text-sm font-semibold text-gray-400 border-r border-gray-300 pr-2">62</span>
              </div>
              <input
                required
                disabled={isLoading}
                type="tel"
                placeholder="8123456789"
                className="w-full pl-20 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all disabled:opacity-60"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-gray-400 ml-1 italic">*Gunakan format tanpa angka 0 di depan</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Pesan Pembuka</label>
            <textarea
              required
              disabled={isLoading}
              rows={3}
              placeholder="Tulis pesan pertama..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none disabled:opacity-60"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !phone || !name || !message}
              className="flex-[2] py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;
