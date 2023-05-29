import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './features/canvasSlice';

export const store = configureStore({
  reducer: {
    canvasReducer
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch