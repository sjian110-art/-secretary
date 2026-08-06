import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { Toast } from '../components/Toast';
import mongMypage from '../assets/mascot/mong_mypage.png';

const MypageMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]} ${theme.spacing[3]}`};
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.body};
`;

/* Profile Card */
const ProfileCardSection = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surfaceWarm};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  box-shadow: ${({ theme }) => theme.shadow.default};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[3]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 104px;
  height: 104px;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Avatar = styled.div`
  width: 104px;
  height: 104px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background-color: ${({ theme }) => theme.colors.gray100};
  border: 3px solid ${({ theme }) => theme.colors.gray300};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const AvatarMascot = styled.img`
  width: 82px;
  height: auto;
  object-fit: contain;
`;

const EditProfileBtn = styled.button`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background-color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active {
    transform: scale(0.92);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ProfileName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
  text-align: center;
  margin-bottom: 6px;
`;

const ProfileIntro = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
  text-align: center;
  line-height: 1.55;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ProfileBadges = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Badge = styled.div<{ $type: 'level' | 'heart' }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.2px;

  ${({ $type, theme }) =>
    $type === 'level'
      ? css`
          background-color: ${theme.colors.primaryBg};
          color: ${theme.colors.primaryDark};
        `
      : css`
          background-color: #FFE8E8;
          color: #C85050;
        `}
`;

/* Menu Items List */
const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  width: 100%;
`;

const MenuItem = styled.button<{ $logout?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surfaceWarm};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]} ${theme.spacing[2]} ${theme.spacing[2]}`};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: #F5EFC8;
    box-shadow: ${({ theme }) => theme.shadow.default};
  }

  &:active {
    transform: scale(0.985);
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
`;

const MenuIconWrap = styled.span<{ $type: string }>`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: ${({ $type }) => {
    if ($type === 'secretary') return '#FFF0D8';
    if ($type === 'room') return '#DDE8F8';
    if ($type === 'notification') return '#FFE5DF';
    return '#EEEAE4'; // logout
  }};

  svg {
    display: block;
  }
`;

const MenuLabel = styled.span<{ $logout?: boolean }>`
  flex: 1;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, $logout }) => ($logout ? theme.colors.textSub : theme.colors.text)};
  letter-spacing: -0.2px;
`;

const MenuArrow = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray400};
`;

const AppVersion = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray400};
  letter-spacing: -0.1px;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding-bottom: 4px;
`;

export const MyPage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });
  }, [setHeaderConfig]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
  };

  const handleMenuClick = (menuId: string) => {
    console.log(`메뉴 클릭: ${menuId}`);

    if (menuId === 'menu-secretary' || menuId === 'menu-room') {
      triggerToast('준비 중인 기능입니다.');
    } else if (menuId === 'menu-notification') {
      navigate('/notification');
    } else if (menuId === 'menu-logout') {
      navigate('/login');
    }
  };

  return (
    <MypageMain>
      <ProfileCardSection aria-label="프로필 카드">
        <AvatarWrap>
          <Avatar>
            <AvatarMascot src={mongMypage} alt="몽이 프로필" />
          </Avatar>
          <EditProfileBtn
            type="button"
            onClick={() => triggerToast('프로필 편집은 준비 중입니다.')}
            aria-label="프로필 편집"
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 3L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </EditProfileBtn>
        </AvatarWrap>

        <ProfileName>포근한 여행자</ProfileName>
        <ProfileIntro>오늘도 당신의 지갑을 따뜻하게 지켜드릴게요.</ProfileIntro>

        <ProfileBadges>
          <Badge $type="level">Lv.12 포근한 정원사</Badge>
          <Badge $type="heart">
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M7 11.5C7 11.5 1.5 8 1.5 4.5C1.5 2.84 2.84 1.5 4.5 1.5C5.5 1.5 6.38 2.01 7 2.76C7.62 2.01 8.5 1.5 9.5 1.5C11.16 1.5 12.5 2.84 12.5 4.5C12.5 8 7 11.5 7 11.5Z"
                fill="#E07070"
                stroke="#E07070"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>850</span>
          </Badge>
        </ProfileBadges>
      </ProfileCardSection>

      <MenuList aria-label="마이페이지 메뉴">
        <MenuItem
          type="button"
          id="menu-secretary"
          onClick={() => handleMenuClick('menu-secretary')}
          aria-label="나의 비서 설정으로 이동"
        >
          <MenuIconWrap $type="secretary">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="11" cy="8" r="3.5" stroke="#C8860A" strokeWidth="1.6" />
              <path d="M4 19c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke="#C8860A" stroke-width="1.6" strokeLinecap="round" />
              <circle cx="11" cy="8" r="1.2" fill="#C8860A" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>나의 비서 설정</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#B0A898" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MenuArrow>
        </MenuItem>

        <MenuItem
          type="button"
          id="menu-room"
          onClick={() => handleMenuClick('menu-room')}
          aria-label="방 꾸미기로 이동"
        >
          <MenuIconWrap $type="room">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="7" width="16" height="12" rx="1.5" stroke="#4A7ABA" strokeWidth="1.6" />
              <path d="M7 7V5.5C7 4.12 8.12 3 9.5 3H12.5C13.88 3 15 4.12 15 5.5V7" stroke="#4A7ABA" strokeWidth="1.6" />
              <line x1="3" y1="13" x2="19" y2="13" stroke="#4A7ABA" strokeWidth="1.4" strokeDasharray="2 2" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>방 꾸미기</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#B0A898" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MenuArrow>
        </MenuItem>

        <MenuItem
          type="button"
          id="menu-notification"
          onClick={() => handleMenuClick('menu-notification')}
          aria-label="알림 설정으로 이동"
        >
          <MenuIconWrap $type="notification">
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M10 1C8.3 1 7 2.3 7 4V4.4C4.6 5.2 3 7.4 3 10V14L1 17H19L17 14V10C17 7.4 15.4 5.2 13 4.4V4C13 2.3 11.7 1 10 1Z"
                stroke="#C8503A"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 17.2C7.5 18.5 8.6 19.5 10 19.5C11.4 19.5 12.5 18.5 12.5 17.2"
                stroke="#C8503A"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </MenuIconWrap>
          <MenuLabel>알림 설정</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#B0A898" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MenuArrow>
        </MenuItem>

        <MenuItem
          type="button"
          id="menu-logout"
          onClick={() => handleMenuClick('menu-logout')}
          aria-label="로그아웃"
        >
          <MenuIconWrap $type="logout">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 11H18M18 11L15 8M18 11L15 14" stroke="#888" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 5H5C4.45 5 4 5.45 4 6V16C4 16.55 4.45 17 5 17H14" stroke="#888" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </MenuIconWrap>
          <MenuLabel $logout={true}>로그아웃</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#C8C0B4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </MenuArrow>
        </MenuItem>
      </MenuList>

      <AppVersion>Version 2.4.1 (Mallang Edition)</AppVersion>

      <Toast isOpen={isToastOpen} message={toastMessage} onClose={() => setIsToastOpen(false)} />
    </MypageMain>
  );
};
export default MyPage;
