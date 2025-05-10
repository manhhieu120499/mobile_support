import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    list: [],
    number: 0
  },
  reducers: {
    setNotification: (state, action) => {
      return {
        ...state,
        list: action.payload
      }
    },
    pushNotification: (state, action) => {
        return {
            ...state,
            list: [action.payload, ...state.list]
        }
    },
    updateNumber: (state, action) => {
        return {
            ...state,
            number: action.payload
        }
    },
    increaseNumber: (state) => {
        return {
            ...state,
            number: state.number + 1
        }
    }
  },
});

export const { setNotification, pushNotification, updateNumber, increaseNumber } = notificationSlice.actions;
export default notificationSlice.reducer;
