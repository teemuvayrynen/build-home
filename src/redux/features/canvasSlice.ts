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
    },
    movePoint: (state, action: PayloadAction<any>) => {
      if (action.payload.type === "rectangle") {
        const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
        if (action.payload.index === 0) {
          element.x = action.payload.point.x
          element.y = action.payload.point.y
          element.width = action.payload.oldDim.x - action.payload.point.x
          element.height = action.payload.oldDim.y - action.payload.point.y
        } else if (action.payload.index === 1) {
          element.width = action.payload.point.x - element.x
          element.height = action.payload.point.y - element.y
        } else if (action.payload.index === 2) {
          element.width = action.payload.point.x - element.x
          element.y = action.payload.point.y
          element.height = action.payload.oldDim.y - action.payload.point.y
        } else if (action.payload.index === 3) {
          element.x = action.payload.point.x
          element.width = action.payload.oldDim.x - action.payload.point.x
          element.height = action.payload.point.y - element.y
        }
      } else if (action.payload.type === "line") {
        const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
        const newPos = {
          x: action.payload.point.x - element.x,
          y: action.payload.point.y - element.y
        }
        element.points[action.payload.index] = newPos
      }
    },
    deleteElements: (state, action: PayloadAction<number>) => {
      state.items[action.payload].elements = []  
    },
    addPoint: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
      const newPos = {
        x: action.payload.point.x - element.x,
        y: action.payload.point.y - element.y
      }
      if (action.payload.index === 0) {
        element.points.unshift(newPos)
      } else {
        element.points.push(newPos)
      }
    },
    closedElement: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
      if (action.payload.index === 0) {
        element.points.shift()
      } else {
       element.points.pop()
      }
      element.closed = true
      const historyItem = {
        type: "closed",
        indexOfElements: action.payload.indexOfElements,
        index: action.payload.index,
      }
      let history = state.items[action.payload.currentLevel].history.slice(0, state.items[action.payload.currentLevel].historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.currentLevel].history = history
      state.items[action.payload.currentLevel].historyStep++
    },
    moveElement: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
      element.x = action.payload.point.x
      element.y = action.payload.point.y
    },
    divideLine: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.currentLevel].elements[action.payload.indexOfElements]
      element.points.splice(action.payload.index + 1, 0, action.payload.point)
    },
    undo: (state, action: PayloadAction<number>) => {
      const currentLevel = state.items[action.payload]
      if (currentLevel.historyStep === -1) return
      const historyStep = currentLevel.historyStep
      const historyItem = currentLevel.history[historyStep]
      state.items[action.payload].historyStep--
      const element = currentLevel.elements[historyItem.indexOfElements]

      if (historyItem.type === "closed") {
        element.closed = false
        return
      }
      if (historyItem.type === "add") {
        currentLevel.elements.splice(historyItem.indexOfElements, 1)
        return
      }
      if (historyItem.type === "addPoint") {
        element.points.splice(historyItem.index, 1)
        return
      }
      if (historyItem.type === "deleteElements") {
        currentLevel.elements = historyItem.elements
        return
      }
    },
    redo: (state, action: PayloadAction<number>) => {
      const currentLevel = state.items[action.payload]
      if (currentLevel.historyStep === currentLevel.history.length - 1) return
      currentLevel.historyStep++
      const nextHistoryItem = currentLevel.history[currentLevel.historyStep]
      if (nextHistoryItem.type === "closed") {
        const element = currentLevel.elements[nextHistoryItem.indexOfElements]
        element.closed = true
        return
      }
      if (nextHistoryItem.type === "add") {
        currentLevel.elements.splice(nextHistoryItem.indexOfElements, 0, nextHistoryItem.element)
        return
      }
      if (nextHistoryItem.type === "addPoint") {
        const element = currentLevel.elements[nextHistoryItem.indexOfElements]
        element.points.splice(nextHistoryItem.index, 0, nextHistoryItem.element.points[nextHistoryItem.index])
        return
      }
      if (nextHistoryItem.type === "deleteElements") {
        currentLevel.elements = []
        return
      }
    },
    addHistory: (state, action: PayloadAction<any>) => {
      const currentLevel = state.items[action.payload.currentLevel]
      let historyItem = {}
      if (action.payload.type === "add") {
        historyItem = {
          type: "add",
          indexOfElements: action.payload.indexOfElements,
          element: currentLevel.elements[action.payload.indexOfElements]
        }
      } else if (action.payload.type === "addPoint") {
        historyItem = {
          type: "addPoint",
          indexOfElements: action.payload.indexOfElements,
          index: action.payload.index,
          element: currentLevel.elements[action.payload.indexOfElements]
        }
      } else if (action.payload.type === "deleteElements") {
        historyItem = {
          type: "deleteElements",
          elements: currentLevel.elements
        }
      }
      
      let history = currentLevel.history.slice(0, currentLevel.historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.currentLevel].history = history
      state.items[action.payload.currentLevel].historyStep++
    },
    undoMisClick: (state, action: PayloadAction<any>) => {
      const currentLevel = state.items[action.payload.currentLevel]
      if (action.payload.type === "default") {
        currentLevel.elements.pop()
        return
      } 
      if (action.payload.type === "point") {
        currentLevel.elements[action.payload.indexOfElements].points.splice(action.payload.index, 1)
        return
      }
    },
    copyElements: (state, action: PayloadAction<number>) => {
      const latestLevelIndex = state.items.length - 1
      const copy = {...state.items[action.payload]}
      state.items[latestLevelIndex] = {
        ...state.items[latestLevelIndex],
        elements: copy.elements,
        history: copy.history,
        historyStep: copy.historyStep
      }
    }
  }
})

export const { 
  addLevel,
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
  copyElements
} = canvas.actions;

export default canvas.reducer;