
export const lengthBetweenPoints = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
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
