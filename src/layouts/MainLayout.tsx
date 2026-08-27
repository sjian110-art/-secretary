import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppContainer, MainContent } from './LayoutElements';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { useHeader } from '../contexts/HeaderContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const MainLayout: React.FC = () => {
  const { headerConfig } = useHeader();
  useScrollToTop();

  return (
    <AppContainer>
      <Header
        showBackButton={headerConfig.showBackButton}
        title={headerConfig.title}
        rightIcon={headerConfig.rightIcon}
        onRightClick={headerConfig.onRightClick}
      />
      <MainContent>
        <Outlet />
      </MainContent>
      <BottomNavigation />
    </AppContainer>
  );
};
export default MainLayout;
