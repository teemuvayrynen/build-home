import { configureStore, createListenerMiddleware, isAnyOf, isAllOf } from '@reduxjs/toolkit';
import canvasReducer from './features/canvasSlice';
import {addLevel,
  deleteLevel,
  addElement,
  movePoint,
  deleteElements,
  addPoint,
  closedElement,
  moveElement,
  divideLine,
  undo,
  redo,
  addHistory,
  undoMisClick,
  copyElements} from './features/canvasSlice';

type CanvasState = {
  items: any[];
}

const initialState = {
  items: [{
    id: 0,
    elements: [],
    history: [],
    historyStep: -1
  }]
} as CanvasState;

const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
  matcher: isAnyOf(deleteLevel, addElement, movePoint, deleteElements, addPoint, closedElement, moveElement, divideLine, undo, redo, addHistory, undoMisClick, copyElements),
  effect: (action, listeneAPI) => {
    localStorage.setItem('canvasState', JSON.stringify(listeneAPI.getState() as RootState))
  }
})

const canvasState = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem('canvasState') || "null" ) : null

export const store = configureStore({
  // preloadedState: {
  //   canvasReducer: canvasState === null ? initialState : canvasState
  // },
  reducer: {
    canvas: canvasReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch