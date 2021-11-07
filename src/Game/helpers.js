import { useEffect, useRef } from 'react';
import { DOWN, LEFT, RIGHT, UP, SIZE } from './constants';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const random = (items) => items[Math.floor(Math.random() * items.length)];

export const getNextPoint = (direction, activePosition) => {
  let row = activePosition[0];
  let column = activePosition[1];
  switch (direction) {
    case UP:
      row -= 1;
      break;
    case DOWN:
      row += 1;
      break;
    case LEFT:
      column -= 1;
      break;
    case RIGHT:
    default:
      column += 1;
  }
  return [row, column];
}

export const getNextFoodPoint = (snakePoints, foodPoints = []) => {
  const filledPoints = [...foodPoints, ...snakePoints];
  const allPoints = new Array(SIZE).fill(null).map((_, i) => (
    new Array(SIZE).fill(null).map((_, j) => [i, j])
  )).flat();
  const possiblePoints = allPoints.filter(
    (possiblePoint) => !filledPoints.some(
      (filledPoint) => possiblePoint[0] === filledPoint[0] && possiblePoint[1] === filledPoint[1]
    )
  );
  return random(possiblePoints);
}

export const hasNextPoint = (point, nextPoint) => point[0] === nextPoint[0] && point[1] === nextPoint[1];

export const mapPoints = (points) => {
  const map = new Array(SIZE).fill(null).reduce((acc, _, i) => {
    acc[i] = [];
    return acc;
  }, {});

  for (let i = 0; i < points.length; i++) {
    map[points[i][0]].push(points[i][1]);
  }

  return map;
}