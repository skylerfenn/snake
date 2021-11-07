import styled from 'styled-components';

export const GameOver = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  & > * {
    z-index: 100;
  }

  &, &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:before {
    content: '';
    opacity: .8;
    background: black;
  }
`;

export const Container = styled.div`
  position: relative;
  display: inline-block;
  border: solid 1px;
`;

export const Row = styled.div`
  display: flex;
`;

export const Cell = styled.div`
  width: 50px;
  height: 50px;
  border: solid 1px;
  background: ${props => {
    if (props.snake) {
      return 'green';
    }
    if (props.food) {
      return 'red';
    }
    return 'none';
  }};
  opacity: ${props => props.gameOver ? .5 : 1};
`;
