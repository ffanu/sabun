
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import NewChatModal from './components/NewChatModal';
import Login from './components/Login';
import { QontakRoom, QontakMessage, AppState } from './types';
import { fetchRooms, fetchMessages, sendMessage, startNewChat, isDemoMode } from './services/qontakService';
import { RefreshCw, AlertCircle, MessageSquare, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state, setState] = useState<AppState>({
    rooms: [],
    activeRoomId: null,
    messages: {},
    loading: true,
    error: null,
    isNewChatModalOpen: false,
  });

  const [isModalLoading, setIsModalLoading] = useState(false);
  const pollingIntervalRef = useRef<number | null>(null);

  const loadRooms = useCallback(async (isInitial = false) => {
    if (isInitial) setState(prev => ({ ...prev, loading: true }));
    try {
      const rooms = await fetchRooms();
      setState(prev => ({ ...prev, rooms, loading: false }));
    } catch (err) {
      if (isInitial) {
        const mockRooms = await fetchRooms();
        setState(prev => ({ 
            ...prev, 
            rooms: mockRooms,
            loading: false,
            error: mockRooms.length === 0 ? 'Gagal memuat CMS. Silakan periksa koneksi atau API Token Anda.' : null
        }));
      }
    }
  }, []);

  const loadActiveMessages = useCallback(async () => {
    if (!state.activeRoomId) return;
    try {
      const messages = await fetchMessages(state.activeRoomId);
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [state.activeRoomId!]: messages,
        }
      }));
    } catch (err) {
      console.warn("Polling error for messages", err);
    }
  }, [state.activeRoomId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRooms(true);
    }
  }, [loadRooms, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = window.setInterval(() => {
      loadRooms(false);
      if (state.activeRoomId) {
        loadActiveMessages();
      }
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [loadRooms, loadActiveMessages, state.activeRoomId, isAuthenticated]);

  const handleRoomSelect = async (roomId: string) => {
    setState(prev => ({ ...prev, activeRoomId: roomId }));
    const messages = await fetchMessages(roomId);
    setState(prev => ({
      ...prev,
      messages: { ...prev.messages, [roomId]: messages }
    }));
  };

  const handleSendMessage = async (text: string) => {
    const { activeRoomId } = state;
    if (!activeRoomId) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: QontakMessage = {
      id: tempId,
      room_id: activeRoomId,
      body: text,
      type: 'text',
      sender_name: 'Agent',
      sender_type: 'agent',
      created_at: new Date().toISOString(),
      status: 'sent',
    };

    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [activeRoomId]: [...(prev.messages[activeRoomId] || []), optimisticMsg]
      }
    }));

    try {
      const sentMsg = await sendMessage(activeRoomId, text);
      if (sentMsg) {
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [activeRoomId]: (prev.messages[activeRoomId] || []).map(m => m.id === tempId ? sentMsg : m)
          }
        }));
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleStartNewChat = async (phone: string, name: string, message: string) => {
    try {
      setIsModalLoading(true);
      const result = await startNewChat(phone, name, message);
      
      if (isDemoMode) {
          const localRoomId = result.room_id || `room_local_${Date.now()}`;
          const newRoom: QontakRoom = {
              id: localRoomId,
              name: name,
              phone_number: phone,
              last_message: message,
              last_message_at: new Date().toISOString(),
              unread_count: 0,
              channel_type: 'whatsapp',
              customer_id: `cust_${Date.now()}`
          };
          
          setState(prev => ({
              ...prev,
              rooms: [newRoom, ...prev.rooms],
              activeRoomId: localRoomId,
              messages: {
                  ...prev.messages,
                  [localRoomId]: [{
                      id: `msg_${Date.now()}`,
                      room_id: localRoomId,
                      body: message,
                      type: 'text',
                      sender_name: 'Agent',
                      sender_type: 'agent',
                      created_at: new Date().toISOString(),
                      status: 'sent'
                  }]
              },
              isNewChatModalOpen: false
          }));
      } else {
          await loadRooms();
          if (result && result.room_id) {
            handleRoomSelect(result.room_id);
          } else {
            loadRooms();
          }
          setState(prev => ({ ...prev, isNewChatModalOpen: false }));
      }
    } catch (err) {
      console.error("Error in handleStartNewChat", err);
    } finally {
      setIsModalLoading(false);
    }
  };

  // If not logged in, show the iCloud style login page
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const activeRoom = state.rooms.find(r => r.id === state.activeRoomId) || null;
  const activeMessages = state.activeRoomId ? (state.messages[state.activeRoomId] || []) : [];

  if (state.loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <ShieldAlert className="absolute inset-0 m-auto w-6 h-6 text-indigo-600" />
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Menghubungkan ke Qontak...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f0f2f5] animate-in fade-in duration-1000">
      {isDemoMode && (
        <div className="bg-amber-500 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-medium uppercase tracking-widest z-[100]">
          <ShieldAlert className="w-3 h-3" />
          Demo Mode: Direct API access blocked by browser CORS. Using simulated data.
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className={`${state.activeRoomId ? 'hidden md:block' : 'block'} h-full flex-shrink-0`}>
          <Sidebar 
            rooms={state.rooms} 
            activeRoomId={state.activeRoomId} 
            onRoomSelect={handleRoomSelect} 
            onNewChat={() => setState(prev => ({ ...prev, isNewChatModalOpen: true }))}
          />
        </div>

        <div className={`${state.activeRoomId ? 'block' : 'hidden md:block'} flex-1 flex flex-col h-full overflow-hidden shadow-2xl`}>
          {state.activeRoomId && (
              <button 
                  onClick={() => setState(prev => ({ ...prev, activeRoomId: null }))}
                  className="md:hidden absolute top-12 left-4 z-[60] bg-white p-2 rounded-full shadow-lg text-gray-600"
              >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
              </button>
          )}
          
          {state.error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                  <AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Masalah Koneksi</h2>
                  <p className="text-gray-600 mb-6 max-w-sm">{state.error}</p>
                  <button 
                    onClick={() => loadRooms(true)}
                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                  >
                    Segarkan Halaman
                  </button>
              </div>
            </div>
          ) : (
            <ChatArea 
              room={activeRoom} 
              messages={activeMessages} 
              onSendMessage={handleSendMessage} 
            />
          )}
        </div>
      </div>

      <NewChatModal 
        isOpen={state.isNewChatModalOpen}
        isLoading={isModalLoading}
        onClose={() => setState(prev => ({ ...prev, isNewChatModalOpen: false }))}
        onStartChat={handleStartNewChat}
      />
    </div>
  );
};

export default App;
