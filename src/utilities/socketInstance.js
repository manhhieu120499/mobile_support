let stompClient = null;

export const setStompClient = (client) => {
  stompClient = client;
};

export const getStompClient = () => stompClient;

export const deactivateSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
