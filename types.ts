
export interface QontakRoom {
  id: string;
  name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  avatar_url?: string;
  channel_type: string;
  customer_id: string;
  phone_number: string;
}

export interface QontakMessage {
  id: string;
  room_id: string;
  body: string;
  type: 'text' | 'image' | 'video' | 'file';
  sender_name: string;
  sender_type: 'agent' | 'customer' | 'system';
  created_at: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface AppState {
  rooms: QontakRoom[];
  activeRoomId: string | null;
  messages: Record<string, QontakMessage[]>;
  loading: boolean;
  error: string | null;
  isNewChatModalOpen: boolean;
}
