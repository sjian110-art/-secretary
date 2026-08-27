import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppContainer } from './LayoutElements';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const EmptyLayout: React.FC = () => {
  useScrollToTop();

  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
};
export default EmptyLayout;
