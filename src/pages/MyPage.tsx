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
  padding: 16px 20px 32px 20px;
  gap: 20px;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.body};
  background-color: ${({ theme }) => theme.colors.cream};
`;

/* Profile Card */
const ProfileCardSection = styled.section`
  width: 100%;
  background-color: #FEF7DE; /* Warm tone background matching mockup */
  border-radius: 36px;
  box-shadow: 0 8px 24px rgba(222, 214, 187, 0.4); /* soft warm shadow */
  padding: 32px 24px 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarRing = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  border: 2px solid #EFE7D3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: transparent;
`;

const Avatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 1px solid #EFE7D3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const AvatarMascot = styled.img`
  width: 86px;
  height: auto;
  object-fit: contain;
`;

const EditProfileBtn = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #7AA672; /* Pleasant green matching mockup */
  border: 2.5px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transition: background-color ${({ theme }) => theme.transition.default}, transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: #5C8A4C;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 14px;
    height: 14px;
    display: block;
  }
`;

const ProfileName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
  font-weight: 400;
  color: #3A3A3A;
  text-align: center;
  margin-bottom: 6px;
`;

const ProfileIntro = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 400;
  color: #7A7A7A;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ProfileBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BadgeButton = styled.button<{ $type: 'level' | 'heart' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transition.fast}, opacity ${({ theme }) => theme.transition.fast}, background-color ${({ theme }) => theme.transition.default};
  box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.04);
  border: none;
  outline: none;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }

  ${({ $type }) =>
    $type === 'level'
      ? css`
          background-color: #EBE5D6;
          color: #8C7B5D;
        `
      : css`
          background-color: #F8E7E7;
          color: #C55858;
        `}
`;

/* Menu Items List */
const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  background-color: #FEFAE8; /* Matches theme.colors.surfaceWarm */
  border-radius: 24px;
  padding: 14px 20px 14px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.default}, box-shadow ${({ theme }) => theme.transition.default}, transform ${({ theme }) => theme.transition.fast};
  border: none;
  outline: none;

  &:hover {
    background-color: #FFF5D1;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: scale(0.985);
  }
`;

const MenuIconWrap = styled.span<{ $type: string }>`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: ${({ $type }) => {
    if ($type === 'secretary') return '#FBEFD5';
    if ($type === 'room') return '#E2EEFA';
    if ($type === 'notification') return '#FAEBE6';
    if ($type === 'customer') return '#E1EDF7';
    return '#EFECE7'; // logout
  }};

  color: ${({ $type }) => {
    if ($type === 'secretary') return '#9B6C1A';
    if ($type === 'room') return '#2D609A';
    if ($type === 'notification') return '#B64C38';
    if ($type === 'customer') return '#2E6C9B';
    return '#7A7A7A'; // logout
  }};

  svg {
    display: block;
    width: 20px;
    height: 20px;
  }
`;

const MenuLabel = styled.span`
  flex: 1;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: #3A3A3A;
`;

const MenuArrow = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #B0A898;
`;

const AppVersion = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 500;
  color: #A7B3C3;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 16px;
`;

export const MyPage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [assistantName] = useState(() => localStorage.getItem('assistantName') || '포근한 여행자');
  const [userHearts] = useState(() => {
    const saved = localStorage.getItem('userHearts');
    return saved ? Number(saved) : 850;
  });

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

    if (menuId === 'menu-secretary') {
      navigate('/mypage/assistant-settings');
    } else if (menuId === 'menu-room') {
      navigate('/mypage/room');
    } else if (menuId === 'menu-customer') {
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
        <AvatarRing>
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
        </AvatarRing>

        <ProfileName>{assistantName}</ProfileName>
        <ProfileIntro>오늘도 당신의 지갑을 따뜻하게 지켜드릴게요.</ProfileIntro>

        <ProfileBadges>
          <BadgeButton
            $type="level"
            onClick={() => triggerToast('레벨 정보는 준비 중입니다.')}
            aria-label="레벨 정보 조회"
          >
            Lv.12 포근한 정원사
          </BadgeButton>
          <BadgeButton
            $type="heart"
            onClick={() => triggerToast('하트 정보는 준비 중입니다.')}
            aria-label="하트 정보 조회"
          >
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M7 11.5C7 11.5 1.5 8 1.5 4.5C1.5 2.84 2.84 1.5 4.5 1.5C5.5 1.5 6.38 2.01 7 2.76C7.62 2.01 8.5 1.5 9.5 1.5C11.16 1.5 12.5 2.84 12.5 4.5C12.5 8 7 11.5 7 11.5Z"
                fill="#C55858"
                stroke="#C55858"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{userHearts}</span>
          </BadgeButton>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 19.5c0-1.5-1-2.5-2.5-3.2v-.8c1.8-.8 3-2.5 3-4.5 0-2.8-2.2-5-5-5s-5 2.2-5 5c0 2 1.2 3.7 3 4.5v.8c-1.5.7-2.5 1.7-2.5 3.2" />
              <path d="M9.5 9.5c0-1.2 1-2 2-2s2 .8 2 2c0 .8-.8 1.2-1.2 1.5-.4.3-.8.8-.8 1.3" />
              <circle cx="11.5" cy="14" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>나의 비서 설정</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 4v16M2 11h20M22 8v12" />
              <rect x="5" y="8" width="6" height="3" rx="1" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>방 꾸미기</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>알림 설정</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MenuArrow>
        </MenuItem>

        <MenuItem
          type="button"
          id="menu-customer"
          onClick={() => handleMenuClick('menu-customer')}
          aria-label="고객 센터로 이동"
        >
          <MenuIconWrap $type="customer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              <path d="M18 10h1v4h-1zM5 10h1v4H5z" />
              <path d="M18 12c0 2-1 3.5-3 3.5h-1.5" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>고객 센터</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </MenuIconWrap>
          <MenuLabel>로그아웃</MenuLabel>
          <MenuArrow aria-hidden="true">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
