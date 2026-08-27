import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/images/logo_img.png';
import logoText from '../assets/images/logo.png';

export interface HeaderProps {
  showBackButton?: boolean;
  title?: string | React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.size.headerHeight};
  padding: 0 ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.cream};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.icon.md};
  height: ${({ theme }) => theme.icon.md};
  color: ${({ theme }) => theme.colors.primaryDark};
  transition: transform ${({ theme }) => theme.transition.fast};

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;
`;

const LogoIconImg = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
`;

const LogoTextImg = styled.img`
  height: 22px;
  width: auto;
  object-fit: contain;
`;

const TitleText = styled.div`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.icon.md};
  height: ${({ theme }) => theme.icon.md};
  color: ${({ theme }) => theme.colors.primary};
  transition:
    color ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 100%;
    height: 100%;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
`;

const Placeholder = styled.div`
  width: ${({ theme }) => theme.icon.md};
  height: ${({ theme }) => theme.icon.md};
`;

export const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  title,
  rightIcon,
  onRightClick,
}) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <HeaderLeft>
        {showBackButton ? (
          <BackButton onClick={() => navigate(-1)} aria-label="이전 페이지로 이동">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BackButton>
        ) : null}

        {!title ? (
          <HeaderLogo onClick={() => navigate('/home')}>
            <LogoIconImg src={logoIcon} alt="몽이" />
            <LogoTextImg src={logoText} alt="말랑말랑" />
          </HeaderLogo>
        ) : (
          <TitleText>{title}</TitleText>
        )}
      </HeaderLeft>

      {onRightClick && rightIcon ? (
        <IconButton onClick={onRightClick} aria-label="오른쪽 버튼" type="button">
          {rightIcon}
        </IconButton>
      ) : onRightClick ? (
        <IconButton onClick={onRightClick} aria-label="알림" type="button">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C10.3 2 9 3.3 9 5V5.4C6.6 6.2 5 8.4 5 11V15L3 18H21L19 15V11C19 8.4 17.4 6.2 15 5.4V5C15 3.3 13.7 2 12 2Z"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 18.2C9.5 19.5 10.6 20.5 12 20.5C13.4 20.5 14.5 19.5 14.5 18.2"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>
      ) : (
        <Placeholder />
      )}
    </HeaderContainer>
  );
};
