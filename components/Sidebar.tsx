
import React, { useState } from 'react';
import { QontakRoom } from '../types';
import { Search, MoreVertical, Plus, User, Filter } from 'lucide-react';

interface SidebarProps {
  rooms: QontakRoom[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ rooms, activeRoomId, onRoomSelect, onNewChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline] = useState(true); // Mock status for the agent

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.phone_number.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-96 border-r border-gray-300 bg-white">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            {/* Mobile status indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-50 lg:hidden ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-semibold text-gray-700 leading-tight">Agent Admin</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-gray-500">
          <button 
            onClick={onNewChat}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
            title="Mulai Chat Baru"
          >
            <Plus className="w-5 h-5 group-hover:text-indigo-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Filter className="w-5 h-5 cursor-pointer hover:text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white">
        <div className="relative flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-500 transition-all border border-transparent focus-within:border-indigo-100">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Cari chat atau nomor..." 
            className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div 
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
              className={`flex items-center p-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeRoomId === room.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {room.avatar_url ? (
                    <img src={room.avatar_url} alt={room.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full p-0.5 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </div>

              {/* Chat Info */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{room.name}</h3>
                  <span className={`text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded-full ${activeRoomId === room.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                    {new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate pr-4 ${room.unread_count > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                    {room.last_message}
                  </p>
                  {room.unread_count > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                      {room.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-400 text-sm">
            Tidak ada chat yang sesuai
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
