import styled from 'styled-components';

export const AppContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.cream};
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding-bottom: calc(${({ theme }) => theme.size.navHeight} + 16px); /* Padding for bottom nav overlay */
`;
