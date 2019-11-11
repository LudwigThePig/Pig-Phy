import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Index = () => {
  const ref = useRef(null);

  useEffect(() => {
    // const canvas = this.refs.canvas;
    // const ctx = canvas.getContext('2d');
  });

  return (
    <Canvas ref={ref} height={window.innerHeight} width={window.innerWidth} />
  );
};

export default Index;
