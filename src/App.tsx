import React from 'react';
import Index from './PageIndex';
import styled, { ThemeProvider } from 'styled-components';
import ThemeContext from './utils/context';

import theme from './StyledComponents/theme';

const Layout = styled.div`
  background: ${({ theme }) => theme.primaryColor};
  color: ${({ theme }) => theme.secondaryColor}
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const App: React.FC = () => {
  return (
    <ThemeContext.Provider value={'dark'}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Index />
        </Layout>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
