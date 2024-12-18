import Levels from '../data/levels.json';
import Settings from './settings.json';
import type { Level } from './types.js';



export function binFind<T>(
    list: readonly T[],
    compareFunction: (element: T) => number
  ): T | undefined {
    let min = 0; // Inclusive
    let max = list.length - 1; // Inclusive
  
    while (min <= max) {
      const mid = min + Math.trunc((max - min) / 2);
      const direction = compareFunction(list[mid]);
      if (direction === 0) return list[mid];
      if (direction < 0) min = mid + 1;
      else max = mid - 1;
    }
  
    return undefined;
  }
  
export const getLevelByScore = (score: number = 0) =>
    (binFind(Levels, (level) => {
      if (score >= level.min && score <= level.max) {
        return 0;
      } else if (score < level.min) {
        return 1;
      } else {
        return -1;
      }
    }) as Level) ?? (Levels[0] as Level);
  