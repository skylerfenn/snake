import { useCallback, useEffect, useState } from 'react';
import { Cell, Container, GameOver, Row } from './styled';
import { getNextFoodPoint, getNextPoint, hasNextPoint, mapPoints, useInterval } from './helpers';
import { DOWN, LEFT, RIGHT, UP, SIZE } from './constants';

const initialSnakePoints = [
  [0, 0],
  [0, 1],
  [0, 2],
];

const Game = () => {
  const [direction, setDirection] = useState(RIGHT);
  const [snakePoints, setSnakePoints] = useState(initialSnakePoints);
  const [foodPoints, setFoodPoints] = useState([getNextFoodPoint(snakePoints)]);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const togglePaused = useCallback(() => setPaused(!paused), [paused]);

  const reset = useCallback(() => {
    setDirection(RIGHT);
    setSnakePoints(initialSnakePoints);
    setFoodPoints([getNextFoodPoint(initialSnakePoints)]);
    setGameOver(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if ([' ', 'Enter'].includes(e.key)) {
        togglePaused();
        if (gameOver) {
          reset();
        }
      }
      // only allow changing direction when game isn't paused to prevent cheating
      if (!paused) {
        if (e.key === 'ArrowRight') {
          setDirection(RIGHT);
        }
        if (e.key === 'ArrowLeft') {
          setDirection(LEFT);
        }
        if (e.key === 'ArrowUp') {
          setDirection(UP);
        }
        if (e.key === 'ArrowDown') {
          setDirection(DOWN);
        }
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [paused, reset, togglePaused, gameOver, setDirection]);

  const handleMove = useCallback((nextSnakePoint) => {

    const [...nextSnakePoints] = snakePoints;
    let [...nextFoodPoints] = foodPoints;

    const ateFood = foodPoints.some((foodPoint) => hasNextPoint(foodPoint, nextSnakePoint));

    if (ateFood) {
      nextFoodPoints = nextFoodPoints.filter((foodPoint) => !hasNextPoint(foodPoint, nextSnakePoint)); // remove ate food
      const nextFoodPoint = getNextFoodPoint(nextSnakePoints, nextFoodPoints); // make next food
      setFoodPoints([...nextFoodPoints, nextFoodPoint]); // add next food
    } else {
      // if next point is NOT food, don't remove
      nextSnakePoints.shift();
    }

    setSnakePoints([...nextSnakePoints, nextSnakePoint]);

  }, [snakePoints, setSnakePoints, foodPoints, setFoodPoints]);

  const tick = useCallback(() => {
    if (gameOver || paused) {
      return;
    }
    const activePoint = snakePoints[snakePoints.length - 1];

    const nextPoint = getNextPoint(direction, activePoint);

    // if nextPoint is out of range, game over.
    if (
      nextPoint[0] < 0 ||
      nextPoint[1] < 0 ||
      nextPoint[0] > SIZE - 1 ||
      nextPoint[1] > SIZE - 1
    ) {
      setGameOver(true);
      return;
    }

    // if nextPoint is in points, game over.
    if (snakePoints.some((point => hasNextPoint(point, nextPoint)))) {
      setGameOver(true);
      return;
    }

    handleMove(nextPoint);
  }, [setGameOver, paused, gameOver, direction, handleMove, snakePoints]);

  const score = snakePoints.length - initialSnakePoints.length;

  let delay = 300 - (50 * Math.floor(score / 10));

  useInterval(tick, delay);

  const snake = mapPoints(snakePoints);
  const food = mapPoints(foodPoints);

  return (
    <Container>
      {new Array(SIZE).fill(null).map(
        (_, i) => <Row key={i}>
          {new Array(SIZE).fill(null).map(
            (_, j) => <Cell
              key={j}
              className="cell"
              snake={snake[i].includes(j)}
              food={food[i].includes(j)}
              gameOver={gameOver}
            />
          )}
        </Row>
      )}
      {gameOver && <GameOver>
        <h3>Game Over</h3>
        <button onClick={reset}>Try again?</button>
      </GameOver>}
      <h3>Score: {score}</h3>
    </Container>
  )
};

export default Game;
