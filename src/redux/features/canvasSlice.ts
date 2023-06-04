import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      state.items[action.payload.floor].elements.push(action.payload.element)
    },
    movePoint: (state, action: PayloadAction<any>) => {
      if (action.payload.type === "rectangle") {
        const element = state.items[action.payload.floor].elements[action.payload.indexOfElements]
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
        const element = state.items[action.payload.floor].elements[action.payload.indexOfElements]
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
      const element = state.items[action.payload.floor].elements[action.payload.indexOfElements]
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
      const element = state.items[action.payload.floor].elements[action.payload.indexOfElements]
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
      let history = state.items[action.payload.floor].history.slice(0, state.items[action.payload.floor].historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.floor].history = history
      state.items[action.payload.floor].historyStep++
    },
    moveElement: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.indexOfElements]
      element.x = action.payload.point.x
      element.y = action.payload.point.y
    },
    divideLine: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.indexOfElements]
      element.points.splice(action.payload.index, 0, action.payload.point)
    },
    undo: (state, action: PayloadAction<number>) => {
      const floor = state.items[action.payload]
      if (floor.historyStep === -1) return
      const historyStep = floor.historyStep
      const historyItem = floor.history[historyStep]
      state.items[action.payload].historyStep--
      const element = floor.elements[historyItem.indexOfElements]

      if (historyItem.type === "closed") {
        element.closed = false
        return
      }
      if (historyItem.type === "add") {
        floor.elements.splice(historyItem.indexOfElements, 1)
        return
      }
      if (historyItem.type === "addPoint") {
        element.points.splice(historyItem.index, 1)
        return
      }
      if (historyItem.type === "deleteElements") {
        floor.elements = historyItem.elements
        return
      }
    },
    redo: (state, action: PayloadAction<number>) => {
      const floor = state.items[action.payload]
      if (floor.historyStep === floor.history.length - 1) return
      floor.historyStep++
      const nextHistoryItem = floor.history[floor.historyStep]
      if (nextHistoryItem.type === "closed") {
        const element = floor.elements[nextHistoryItem.indexOfElements]
        element.closed = true
        return
      }
      if (nextHistoryItem.type === "add") {
        floor.elements.splice(nextHistoryItem.indexOfElements, 0, nextHistoryItem.element)
        return
      }
      if (nextHistoryItem.type === "addPoint") {
        const element = floor.elements[nextHistoryItem.indexOfElements]
        element.points.splice(nextHistoryItem.index, 0, nextHistoryItem.element.points[nextHistoryItem.index])
        return
      }
      if (nextHistoryItem.type === "deleteElements") {
        floor.elements = []
        return
      }
    },
    addHistory: (state, action: PayloadAction<any>) => {
      const floor = state.items[action.payload.floor]
      let historyItem = {}
      if (action.payload.type === "add") {
        historyItem = {
          type: "add",
          indexOfElements: action.payload.indexOfElements,
          element: floor.elements[action.payload.indexOfElements]
        }
      } else if (action.payload.type === "addPoint") {
        historyItem = {
          type: "addPoint",
          indexOfElements: action.payload.indexOfElements,
          index: action.payload.index,
          element: floor.elements[action.payload.indexOfElements]
        }
      } else if (action.payload.type === "deleteElements") {
        historyItem = {
          type: "deleteElements",
          elements: floor.elements
        }
      }
      
      let history = floor.history.slice(0, floor.historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.floor].history = history
      state.items[action.payload.floor].historyStep++
    },
    undoMisClick: (state, action: PayloadAction<any>) => {
      const floor = state.items[action.payload.floor]
      if (action.payload.type === "default") {
        floor.elements.pop()
        return
      } 
      if (action.payload.type === "point") {
        floor.elements[action.payload.indexOfElements].points.splice(action.payload.index, 1)
        return
      }
    },
    copyElements: (state, action: PayloadAction<number>) => {
      const floorIndex = state.items.length - 1
      const copy = {...state.items[action.payload]}
      state.items[floorIndex] = {
        ...state.items[floorIndex],
        elements: copy.elements,
        history: copy.history,
        historyStep: copy.historyStep
      }
    },
    rotateElement: (state, action: PayloadAction<any>) => {
      state.items[action.payload.floor].elements[action.payload.indexOfElements].rotation = action.payload.rotation
    },
    changeStrokeWidth: (state, action: PayloadAction<any>) => {
      state.items[action.payload.floor].elements[action.payload.indexOfElements].strokeWidth = action.payload.strokeWidth
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
  copyElements,
  rotateElement,
  changeStrokeWidth
} = canvas.actions;

export default canvas.reducer;