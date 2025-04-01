import {AllowedShapes} from "../actions/shapes";

export function getCreditsForShape(shape: AllowedShapes){
  switch (shape) {
    case 'rectangle':
      return 1
    case 'triangle':
      return 2
    case 'circle':
      return 3
    default:
      throw new Error(`Unknown shape: ${shape}`)
  }
}