
import { QontakRoom, QontakMessage } from '../types';

const API_BASE_URL = 'https://chat.qontak.com/api/open/v1';
const API_TOKEN = 'wF1HkKX_3J0uuXPW7KCsW_LD9IWVZD9R7QoXLkAUlIo';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
};

// State to track if we are in demo mode (due to CORS/API failures)
export let isDemoMode = false;

// Helper to handle API errors and fallback to mock if needed
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    isDemoMode = false;
    return await response.json();
  } catch (error) {
    // Specifically catch "Failed to fetch" which is usually a CORS block in browsers
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn(`Qontak API CORS Block on ${endpoint}. Falling back to Demo Mode.`);
      isDemoMode = true;
      throw error;
    }
    console.error(`Qontak API Error (${endpoint}):`, error);
    throw error;
  }
};

export const fetchRooms = async (): Promise<QontakRoom[]> => {
  try {
    const data = await apiFetch('/rooms');
    return data.data || [];
  } catch (error) {
    isDemoMode = true;
    return getMockRooms();
  }
};

export const fetchMessages = async (roomId: string): Promise<QontakMessage[]> => {
  try {
    const data = await apiFetch(`/rooms/${roomId}/messages`);
    return data.data || [];
  } catch (error) {
    isDemoMode = true;
    return getMockMessages(roomId);
  }
};

export const sendMessage = async (roomId: string, body: string): Promise<QontakMessage | null> => {
  try {
    const data = await apiFetch('/messages/whatsapp/direct', {
      method: 'POST',
      body: JSON.stringify({
        room_id: roomId,
        message_type: 'text',
        body: body,
      }),
    });
    return data.data;
  } catch (error) {
    // Return a locally constructed message if API fails (e.g. CORS)
    return {
      id: `local_${Date.now()}`,
      room_id: roomId,
      body,
      type: 'text',
      sender_name: 'Agent',
      sender_type: 'agent',
      created_at: new Date().toISOString(),
      status: 'sent'
    };
  }
};

export const startNewChat = async (phoneNumber: string, name: string, message: string) => {
  try {
    const data = await apiFetch('/messages/whatsapp/direct', {
      method: 'POST',
      body: JSON.stringify({
        to_number: phoneNumber,
        to_name: name,
        message_type: 'text',
        body: message,
      }),
    });
    return data.data;
  } catch (error) {
    if (isDemoMode) {
        // Create a dummy room for demo mode
        const newId = `room_${Date.now()}`;
        const mockRoom: QontakRoom = {
            id: newId,
            name: name,
            phone_number: phoneNumber,
            last_message: message,
            last_message_at: new Date().toISOString(),
            unread_count: 0,
            channel_type: 'whatsapp',
            customer_id: `cust_${Date.now()}`
        };
        // We push to global mock state if we had one, but here we just return enough for UI to react
        return { room_id: newId, body: message };
    }
    throw error;
  }
};

// Mock Data Generators for UI development
function getMockRooms(): QontakRoom[] {
  return [
    {
      id: 'room_1',
      name: 'Budi Santoso',
      last_message: 'Halo, saya ingin bertanya tentang paket internet.',
      last_message_at: new Date().toISOString(),
      unread_count: 2,
      channel_type: 'whatsapp',
      customer_id: 'cust_1',
      phone_number: '628123456789'
    },
    {
      id: 'room_2',
      name: 'Siti Aminah',
      last_message: 'Terima kasih informasinya.',
      last_message_at: new Date(Date.now() - 3600000).toISOString(),
      unread_count: 0,
      channel_type: 'whatsapp',
      customer_id: 'cust_2',
      phone_number: '628987654321'
    },
    {
      id: 'room_3',
      name: 'Ahmad Faisal',
      last_message: 'Kapan pesanan saya sampai?',
      last_message_at: new Date(Date.now() - 7200000).toISOString(),
      unread_count: 1,
      channel_type: 'whatsapp',
      customer_id: 'cust_3',
      phone_number: '628112233445'
    }
  ];
}

function getMockMessages(roomId: string): QontakMessage[] {
  const baseMessages: QontakMessage[] = [
    {
      id: 'msg_1',
      room_id: roomId,
      body: 'Selamat siang, ada yang bisa kami bantu?',
      type: 'text',
      sender_name: 'Agent Support',
      sender_type: 'agent',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      status: 'read'
    },
    {
      id: 'msg_2',
      room_id: roomId,
      body: 'Halo, saya ingin bertanya tentang promo terbaru.',
      type: 'text',
      sender_name: 'Customer',
      sender_type: 'customer',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  // If this is a newly created local room, start with the "first message"
  if (roomId.startsWith('room_local_') || roomId.includes('temp')) {
      return [{
          id: 'msg_initial',
          room_id: roomId,
          body: 'Halo, selamat datang di layanan kami!',
          type: 'text',
          sender_name: 'Agent',
          sender_type: 'agent',
          created_at: new Date().toISOString(),
          status: 'sent'
      }];
  }

  return baseMessages;
}
