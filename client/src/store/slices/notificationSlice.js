import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationsRequest, markReadRequest, markAllReadRequest } from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () => {
  const { data } = await fetchNotificationsRequest();
  return data;
});

export const markAsRead = createAsyncThunk('notifications/markRead', async (id) => {
  await markReadRequest(id);
  return id;
});

export const markAllAsRead = createAsyncThunk('notifications/markAllRead', async () => {
  await markAllReadRequest();
  return true;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const item = state.items.find(n => n._id === action.payload);
        if (item && !item.isRead) { item.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach(n => { n.isRead = true; });
        state.unreadCount = 0;
      });
  }
});

export default notificationSlice.reducer;
