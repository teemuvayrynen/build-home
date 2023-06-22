import globals from "../app/globals"

export const lengthBetweenPoints = (a, b) => {
  const l = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) 
  return l
}

export const getNewPointByLength = (a, b, l) => {
  const length = l * globals.lengthParameter
  let initialLength = lengthBetweenPoints(a, b)
  if (initialLength === 0) {
    initialLength = 0.2
  }
  console.log(length)
  const dirX = (b.x - a.x) / initialLength
  const dirY = (b.y - a.y) / initialLength

  const pos = {
    x: a.x + dirX * length,
    y: a.y + dirY * length
  }

  console.log(pos)

  return pos
}

export const lengthBetweenPointsMeters = (a, b) => {
  const l = lengthBetweenPoints(a, b)
  return Math.round(l / globals.lengthParameter * 100) / 100
}

export const angleOfVector = (a, b, c, d) => {
  const dAx = b.x - a.x
  const dAy = b.y - a.y
  const dBx = d.x - c.x
  const dBy = d.y - c.y
  let angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy)
  if (angle < 0) {
    angle = angle * -1;
  }

  return 180 - (angle * (180 / Math.PI)) 
}

export const findLineAngle = (a, b) => {
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI)
  return angle
}

export const midPoint = (a, b) => {
  return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export const calcPolygonArea = (element) => {
  const points = element.points
  let area = 0
  let j = points.length - 1
  for (let i = 0; i < points.length; i++) {
    area += ((element.x + points[j].x) + (element.x + points[i].x)) * ((element.y + points[j].y) - (element.y + points[i].y))
    j = i
  }
  return Math.abs(area / 2)
}

const handleLineCalculaions = (element, pos, i, j) => {
  const p1 = {
    x: element.points[i].x + element.x,
    y: element.points[i].y + element.y
  }
  const p2 = {
    x: element.points[j].x + element.x,
    y: element.points[j].y + element.y
  }
  const l = lengthBetweenPoints(p1, p2)
  const l1 = lengthBetweenPoints(pos, p1)
  const l2 = lengthBetweenPoints(pos, p2)
  if (Math.abs(l1 + l2 - l) < 5) {
    return true
  }
  return false
}

export const getLine = (element, pos) => {
  let index = -1

  for (let i = 0; i < element.points.length; i++) {
    if (i <= element.points.length - 2) {
      const found = handleLineCalculaions(element, pos, i, i + 1)
      if (found) {
        index = i
        break
      }
    }
  }


  if (element.closed && index === -1) {
    const found = handleLineCalculaions(element, pos, element.points.length - 1, 0)
    if (found) {
      index = element.points.length - 1
    }
  }

  return index 
}

export function calculateArea(element) {
  const points = element.points;
  const numPoints = points.length;
  let area = 0;

  for (let i = 0; i < numPoints; i++) {
    const point1 = {
      x: element.x + points[i].x,
      y: element.y + points[i].y,
    }
    const point2 = {
      x: element.x + points[(i + 1) % numPoints].x,
      y: element.y + points[(i + 1) % numPoints].y,
    }

    area += (point2.x + point1.x) * (point2.y - point1.y);
  }

  const pixelsPerMeter = 50;
  const squareMetersPerSquarePixel = 1 / (pixelsPerMeter * pixelsPerMeter);
  const areaInSquareMeters = Math.abs(area) / 2 * squareMetersPerSquarePixel;

  return areaInSquareMeters;
}

export const generateRooms = (canvasState, selectedFloor, numOfRooms) => {
  const elements = canvasState[selectedFloor].elements
  const rooms = []
  let index = -1

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].type === "rectangle") {
      index = i
      break
    }
  }

  if (index !== -1) {
    const offset = 2.5
    let roomAmount = numOfRooms
    const element = elements[index]
    const points = [
      {x: element.x + offset, y: element.y + offset, width: 1, height: 1},
      {x: element.x + element.width - offset, y: element.y + offset, width: -1, height: 1},
      {x: element.x + offset, y: element.y + element.height - offset, width: 1, height: -1},
      {x: element.x + element.width - offset, y: element.y + element.height - offset, width: -1, height: -1}
    ]
    while (roomAmount > 0) {
      const num = getRandomInt(points.length)
      const wallWidth = getRandomArbitrary(2,4)
      const wallHeight = getRandomArbitrary(2,4)
      const point = points[num]
      points.splice(num, 1)
      point.width *= wallWidth * 50
      point.height *= wallHeight * 50
      rooms.push(point)

      const pointObj = {
        x: point.x, y: point.y + point.width, width: point.width > 0 ? 1 : -1, height: point.height > 0 ? 1 : -1
      }
      const pointObj2 = {
        x: point.x + point.width, y: point.y, width: point.width > 0 ? 1 : -1, height: point.height > 0 ? 1 : -1
      }
      points.push(pointObj)
      points.push(pointObj2)
      console.log(points)
      roomAmount--
    }

    return rooms

  }
  return []
}
