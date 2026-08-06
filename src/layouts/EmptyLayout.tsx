import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppContainer } from './LayoutElements';

export const EmptyLayout: React.FC = () => {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
};
export default EmptyLayout;
