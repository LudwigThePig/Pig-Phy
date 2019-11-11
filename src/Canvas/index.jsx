import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../StyledComponents/theme';

const Wrapper = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Canvas = styled.canvas`
  overflow-x: auto;
  border: 1px solid green;
`;

const Index = () => {
  const canvasRef = useRef(null);

  // 16 x 9 aspect ratio
  const height = window.innerHeight * 0.98;
  const width = (height / 9) * 16;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const pt = val => val * (height / 1000);

    ctx.beginPath();
    ctx.strokeStyle = theme.secondaryColor;
    ctx.moveTo(0, 0);
    ctx.lineTo(pt(300), pt(150));
    ctx.stroke();
  }, [canvasRef, height, width]);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} height={height} width={width} />
    </Wrapper>
  );
};

export default Index;
