import { createGlobalStyle } from 'styled-components';
import device from '../utils/breakpoints';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500&display=swap');
    font-family: 'Roboto', sans-serif;
  }
  
  @media ${device.mobile} {
    body { font-size: 6.25px; }
  }
  @media ${device.tablet} {
    body { font-size: 8px; }
  }
  @media ${device.laptop} {
    body { font-size: 10px; }
  }
`;

export default GlobalStyles;
