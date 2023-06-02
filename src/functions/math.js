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
