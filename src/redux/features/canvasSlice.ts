import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';

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

export const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addLevel: (state) => {
      const prev = state.items[state.items.length - 1];
      const newLevel = {
        id: prev.id + 1,
        elements: [],
        history: [],
        historyStep: -1
      }
      state.items.push(newLevel);
    },
    deleteLevel: (state, action: PayloadAction<number>) => {
      if (state.items.length === 1) return
      state.items.splice(action.payload, 1)
      for (let i = action.payload; i < state.items.length; i++) {
        state.items[i].id = i
      }
    },
    addElement: (state, action: PayloadAction<any>) => {
      state.items[action.payload.currentLevel].elements.push(action.payload.element)
      const historyItem = {
        type: "add",
        indexOfElements: action.payload.indexOfElements,
        index: action.payload.index,
        element: action.payload.element
      }
      let history = state.items[action.payload.currentLevel].history.slice(0, state.items[action.payload.currentLevel].historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.currentLevel].history = history
      state.items[action.payload.currentLevel].historyStep++
    },
    movePoint: (state, action: PayloadAction<any>) => {
      if (action.payload.type === "rectangle") {
        state.items[action.payload.currentLevel].elements[action.payload.indexOfElements].points[action.payload.index] = action.payload.point
      } else if (action.payload.type === "line") {
        const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
        const newPos = {
          x: action.payload.point.x - element.x,
          y: action.payload.point.y - element.y
        }
        state.items[action.payload.currentLevel].elements[action.payload.indexOfElements].points[action.payload.index] = newPos
      }
    },
    deleteElements: (state, action: PayloadAction<number>) => {
      state.items[action.payload].elements = []
      state.items[action.payload].history = []
      state.items[action.payload].historyStep = -1      
    },
    addPoint: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
      const newPos = {
        x: action.payload.point.x - element.x,
        y: action.payload.point.y - element.y
      }
      if (action.payload.index === 0) {
        state.items[action.payload.currentLevel].elements[action.payload.indexOfElements].points.unshift(newPos)
      } else {
        state.items[action.payload.currentLevel].elements[action.payload.indexOfElements].points.push(newPos)
      }
      const historyItem = {
        type: "addPoint",
        indexOfElements: action.payload.indexOfElements,
        index: action.payload.index,
        element: state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
      }
      let history = state.items[action.payload.currentLevel].history.slice(0, state.items[action.payload.currentLevel].historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.currentLevel].history = history
      state.items[action.payload.currentLevel].historyStep++
    }
  }
})

export const { 
  addLevel,
  deleteLevel,
  addElement,
  movePoint,
  deleteElements,
  addPoint
} = canvas.actions;

export default canvas.reducer;