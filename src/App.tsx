import React from 'react';
import Index from './PageIndex';
import { ThemeProvider } from 'styled-components';
import ThemeContext from './utils/context';

import theme from './StyledComponents/theme';


const App: React.FC = () => {
  return (
    <ThemeContext.Provider value={'dark'}>
      <ThemeProvider theme={theme}>
        <Index />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
