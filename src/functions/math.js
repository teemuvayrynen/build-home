import globals from "../app/globals"

export const lengthBetweenPoints = (a, b) => {
  const l = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) 
  return l
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

export const randomId = () => {
  return Math.random().toString(36).substring(2, 8)
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
