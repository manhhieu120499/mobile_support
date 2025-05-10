import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { increaseNumber, pushNotification, updateNumber } from '../slice/NotificationSlice';

export const setupSocket = (employeeId, dispatch) => {
  const socket = new SockJS('http://26.246.75.13:8080/ws');
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => console.log('📡', str),
    onWebSocketError: (error) => console.error('🛑 WebSocket error:', error),
    onStompError: (frame) => console.error('❌ STOMP error:', frame),
  });

  stompClient.onConnect = () => {
    console.log('✅ STOMP connected');

    stompClient.subscribe(
      `/topic/notifications/${employeeId}`,
      (message) => {
        if (message.body) {
          const newNotification = JSON.parse(message.body);
          console.log('📩 Nhận thông báo:', newNotification);
          dispatch(pushNotification(newNotification));
          dispatch(increaseNumber())
        }
      }
    );
  };

  stompClient.activate();

  return stompClient;
};
