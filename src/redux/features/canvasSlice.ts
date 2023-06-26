import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

type CanvasState = {
  items: any[];
}

const initialState = {
  items: [{
    id: 0,
    elements: {},
    history: [{
      elements: {}
    }],
    historyStep: 0
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
        elements: {},
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
      state.items[action.payload.floor].elements[action.payload.id] = action.payload.element
    },
    movePoint: (state, action: PayloadAction<any>) => {
      if (action.payload.type === "rectangle") {
        const element = state.items[action.payload.floor].elements[action.payload.id]
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
        const element = state.items[action.payload.floor].elements[action.payload.id]
        const newPos = {
          x: action.payload.point.x - element.x,
          y: action.payload.point.y - element.y
        }
        element.points[action.payload.index].x = newPos.x
        element.points[action.payload.index].y = newPos.y
      }
    },
    moveBezier: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.id]
      const newPos = {
        x: action.payload.point.x - element.x,
        y: action.payload.point.y - element.y
      }
      element.points[action.payload.index].bezierX = newPos.x
      element.points[action.payload.index].bezierY = newPos.y
    },
    deleteElements: (state, action: PayloadAction<number>) => {
      state.items[action.payload].elements = {}
    },
    deleteElement: (state, actions: PayloadAction<any>) => {
      delete state.items[actions.payload.floor].elements[actions.payload.id]
    },
    addPoint: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.id]
      const newPoint = {
        x: action.payload.point.x - element.x,
        y: action.payload.point.y - element.y,
        bezier: action.payload.bezier,
        bezierX: action.payload.bezier ? action.payload.point.x - element.x : 0,
        bezierY: action.payload.bezier ? action.payload.point.y - element.y : 0
      }
      if (action.payload.index === 0) {
        element.points[0].bezier = newPoint.bezier
        element.points.unshift({ x: newPoint.x, y: newPoint.y, bezier: false, bezierX: 0, bezierY: 0 })
      } else {
        element.points.push(newPoint)
      }
    },
    closedElement: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.id]
      element.closed = true
      if (action.payload.index === 0) {
        element.points.shift()
      } else {
       element.points.pop()
      }
    },
    moveElement: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.id]
      element.x = action.payload.point.x
      element.y = action.payload.point.y
    },
    divideLine: (state, action: PayloadAction<any>) => {
      const element = state.items[action.payload.floor].elements[action.payload.id]
      element.points.splice(action.payload.index, 0, action.payload.point)
    },
    undo: (state, action: PayloadAction<number>) => {
      const floor = state.items[action.payload]
      if (floor.historyStep === 0) return
      floor.historyStep--
      const prevHistoryItem = floor.history[floor.historyStep]
      floor.elements = prevHistoryItem.elements    
    },
    redo: (state, action: PayloadAction<number>) => {
      const floor = state.items[action.payload]
      if (floor.historyStep === floor.history.length - 1) return
      floor.historyStep++
      const nextHistoryItem = floor.history[floor.historyStep]
      floor.elements = nextHistoryItem.elements
    },
    undoMisClick: (state, action: PayloadAction<any>) => {
      const floor = state.items[action.payload.floor]
      if (action.payload.type === "default") {
        delete floor.elements[action.payload.id]
        return
      } 
      if (action.payload.type === "point") {
        floor.elements[action.payload.id].points.splice(action.payload.index, 1)
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
    editElement: (state, action: PayloadAction<any>) => {
      state.items[action.payload.floor].elements[action.payload.id].rotation = action.payload.rotation
      state.items[action.payload.floor].elements[action.payload.id].scaleX = action.payload.scaleX
      state.items[action.payload.floor].elements[action.payload.id].scaleY = action.payload.scaleY
    },
    changeStrokeWidth: (state, action: PayloadAction<any>) => {
      state.items[action.payload.floor].elements[action.payload.id].strokeWidth = action.payload.strokeWidth
    },
    removeGeneratedRooms: (state, action: PayloadAction<number>) => {
      const elements = state.items[action.payload].elements 
      for (const key in elements) {
        const element = elements[key]
        if (element.generated) {
          delete elements[key]
        }
      }
    },
    changeRectDim: (state, action: PayloadAction<any>) => {
      state.items[action.payload.floor].elements[action.payload.id].width = action.payload.width
      state.items[action.payload.floor].elements[action.payload.id].height = action.payload.height
    },
    changeToBezier: (state, action: PayloadAction<any>) => {
      const indexes = action.payload.indexes
      const element = state.items[action.payload.floor].elements[action.payload.id]
      for (let i = 0; i < indexes.length; i++) {
        const index = indexes[i]
        const nextIndex = index + 1
        if (nextIndex < element.points.length) {
          const mid = {
            x: (element.points[nextIndex].x + element.points[index].x) / 2,
            y: (element.points[nextIndex].y + element.points[index].y) / 2
          }
          element.points[nextIndex].bezier = true
          element.points[nextIndex].bezierX = mid.x
          element.points[nextIndex].bezierY = mid.y
        }
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(addHistoryAsync.fulfilled, (state, action: PayloadAction<any>) => {
      const floor = state.items[action.payload.floor]
      
      let historyItem = {
        elements: action.payload.elements
      }

      if (floor.history.length === 20) {
        floor.history.shift()
        floor.historyStep--
      }
      
      let history = floor.history.slice(0, floor.historyStep + 1)
      history.push(historyItem)
      state.items[action.payload.floor].history = history
      state.items[action.payload.floor].historyStep++
    })
  }
})

export const addHistoryAsync = createAsyncThunk('addHistoryItem', (parameters, { getState }) => {
  const state = <any> getState()
  return {
    floor: Object(parameters).floor,
    elements: state.canvas.items[Object(parameters).floor].elements
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
  undoMisClick,
  copyElements,
  editElement,
  changeStrokeWidth,
  removeGeneratedRooms,
  deleteElement,
  changeRectDim,
  changeToBezier,
  moveBezier
} = canvas.actions;

export default canvas.reducer;