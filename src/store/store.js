// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../slice/NotificationSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});
