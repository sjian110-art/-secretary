import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.cream};
  padding: ${({ theme }) => `${theme.spacing[1]} 4px calc(${theme.spacing[2]} + env(safe-area-inset-bottom))`};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  border-radius: ${({ theme }) => `${theme.radius.nav} ${theme.radius.nav} 0 0`};
  z-index: 1000;
`;

const NavItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px ${({ theme }) => theme.spacing[1]};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primaryDark : theme.colors.gray500};
  transition: color ${({ theme }) => theme.transition.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const NavIconWrap = styled.span<{ $isActive: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.circle};
  transition: background-color ${({ theme }) => theme.transition.default};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.yellow : 'transparent'};

  svg {
    width: ${({ theme }) => theme.icon.md};
    height: ${({ theme }) => theme.icon.md};
  }

  svg * {
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const NavLabel = styled.span<{ $isActive: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  line-height: 1;
`;

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const isTabActive = (tab: 'home' | 'expense' | 'plan' | 'mypage') => {
    switch (tab) {
      case 'home':
        return pathname === '/home' || pathname === '/';
      case 'expense':
        return pathname === '/expense/history' || pathname === '/expense/write' || pathname === '/statistics';
      case 'plan':
        return pathname === '/expense/plan';
      case 'mypage':
        return pathname === '/mypage' || pathname === '/notification';
      default:
        return false;
    }
  };

  return (
    <NavContainer aria-label="주요 메뉴">
      <NavItem
        $isActive={isTabActive('home')}
        onClick={() => navigate('/home')}
        aria-current={isTabActive('home') ? 'page' : undefined}
      >
        <NavIconWrap $isActive={isTabActive('home')}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 11L12 4L20 11" />
            <path d="M6 9.5V20H18V9.5" />
          </svg>
        </NavIconWrap>
        <NavLabel $isActive={isTabActive('home')}>홈</NavLabel>
      </NavItem>

      <NavItem
        $isActive={isTabActive('expense')}
        onClick={() => navigate('/expense/history')}
        aria-current={isTabActive('expense') ? 'page' : undefined}
      >
        <NavIconWrap $isActive={isTabActive('expense')}>
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="16" x2="13" y2="16" />
          </svg>
        </NavIconWrap>
        <NavLabel $isActive={isTabActive('expense')}>지출</NavLabel>
      </NavItem>

      <NavItem
        $isActive={isTabActive('plan')}
        onClick={() => navigate('/expense/plan')}
        aria-current={isTabActive('plan') ? 'page' : undefined}
      >
        <NavIconWrap $isActive={isTabActive('plan')}>
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="16" y1="3" x2="16" y2="7" />
          </svg>
        </NavIconWrap>
        <NavLabel $isActive={isTabActive('plan')}>계획</NavLabel>
      </NavItem>

      <NavItem
        $isActive={isTabActive('mypage')}
        onClick={() => navigate('/mypage')}
        aria-current={isTabActive('mypage') ? 'page' : undefined}
      >
        <NavIconWrap $isActive={isTabActive('mypage')}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20C4 16 7.5 14 12 14C16.5 14 20 16 20 20" />
          </svg>
        </NavIconWrap>
        <NavLabel $isActive={isTabActive('mypage')}>마이페이지</NavLabel>
      </NavItem>
    </NavContainer>
  );
};
