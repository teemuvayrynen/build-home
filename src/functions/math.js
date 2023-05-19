
export const lengthBetweenPoints = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

export const angleOfVector = (a, b, c, d) => {
  return Math.atan(((b.x - a.x)*(d.x - c.x)+(b.y - a.y)*(d.y - c.y)) 
  / (Math.sqrt(Math.pow(b.x - a.x , 2) + Math.pow(d.x - c.x , 2)) * 
  Math.sqrt(Math.pow(b.y - a.y , 2) + Math.pow(d.y - c.y , 2))))
}

export const midPoint = (a, b) => {
  return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
}
