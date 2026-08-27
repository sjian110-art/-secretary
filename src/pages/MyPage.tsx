import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { Toast } from '../components/Toast';
import mongMypage from '../assets/mascot/mong_mypage.png';
import mongHappy from '../assets/mascot/mong_happy.png';

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

/* Modal Popup Styles */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 360px;
  background-color: #FFFDF4; /* 연한 크림색 */
  border-radius: 40px;
  padding: 32px 24px 24px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: 85vh;
  box-shadow: 0 16px 40px rgba(33, 22, 15, 0.12);
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #3A3A3A;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.9);
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #21160F;
  text-align: center;
  margin: 0 0 20px 0;
`;

const TabBar = styled.div`
  display: flex;
  background-color: #FEF9E7;
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 38px;
  border-radius: 999px;
  border: 0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  ${({ $active }) =>
    $active
      ? css`
          background-color: #C3E8BF; /* 밝은 연그린 */
          color: #1B4C15; /* 짙은 초록 */
        `
      : css`
          background-color: transparent;
          color: #8C8273;
        `}
`;

/* 내 레벨 탭 스타일 */
const ImageWrapper = styled.div`
  width: 130px;
  height: 130px;
  margin: 0 auto 16px;
  background-image: 
    linear-gradient(45deg, #F0EAE1 25%, transparent 25%), 
    linear-gradient(-45deg, #F0EAE1 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #F0EAE1 75%), 
    linear-gradient(-45deg, transparent 75%, #F0EAE1 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
  background-color: #FFFFFF;
  border: 1px solid #E2DCCE;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.03);
`;

const MascotImg = styled.img`
  width: 90px;
  height: auto;
  object-fit: contain;
`;

const LevelBadge = styled.div`
  align-self: center;
  background-color: #FFEED2;
  color: #7D511E;
  font-size: 13px;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const LevelDesc = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: #4E3F30;
  text-align: center;
  margin: 0 0 18px 0;
  white-space: pre-line;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #8C8273;
  margin-bottom: 6px;
  padding: 0 2px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: #EFEAE2;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const ProgressBarFill = styled.div`
  width: 65%;
  height: 100%;
  background-color: #F8D3EB; /* 연한 핑크 */
  border-radius: 999px;
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const GoalCard = styled.div`
  background-color: #FFFCCE;
  border-radius: 20px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(33, 22, 15, 0.01);
  text-align: left;
  position: relative;
  overflow: hidden;

  /* 백그라운드 데코레이션 */
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: -6px;
    width: 32px;
    height: 32px;
    background-color: rgba(255, 238, 178, 0.35);
    border-radius: 50%;
  }
`;

const GoalIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #FFF6A9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const GoalText = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #21160F;
  line-height: 1.4;
`;

const ModalConfirmButton = styled.button<{ $colorType?: 'green' | 'red' }>`
  width: 100%;
  height: 48px;
  border-radius: 999px;
  border: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.97);
  }

  ${({ $colorType }) =>
    $colorType === 'red'
      ? css`
          background-color: #C5251A; /* 하트 팝업용 빨간색 */
          color: #FFFFFF;
          &:hover { background-color: #A31E15; }
        `
      : css`
          background-color: #7AA672; /* 레벨 팝업용 초록색 */
          color: #FFFFFF;
          &:hover { background-color: #5C8A4C; }
        `}
`;

/* 전체 레벨 탭 스타일 */
const LevelListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
  margin-bottom: 24px;
  max-height: 46vh; /* 전체 레벨 리스트가 적절하게 피팅되도록 높이 지정 */

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #E2DCCE;
    border-radius: 4px;
  }
`;

const LevelRow = styled.div<{ $isCurrent: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 999px;
  background-color: ${({ $isCurrent }) => ($isCurrent ? '#D6F2D3' : '#FFFDEB')};
  transition: background-color 0.15s ease;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ $isCurrent }) => ($isCurrent ? '#D6F2D3' : '#FFFBC8')};
  }
`;

const LevelNumberCircle = styled.div<{ $isCurrent: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  flex-shrink: 0;

  ${({ $isCurrent }) =>
    $isCurrent
      ? css`
          background-color: #1B4C15;
          color: #FFFFFF;
        `
      : css`
          background-color: #F8F3DF;
          color: #9C896B;
        `}
`;

const LevelRowName = styled.span<{ $isCurrent: boolean }>`
  font-size: 13px;
  font-weight: bold;
  color: ${({ $isCurrent }) => ($isCurrent ? '#1B4C15' : '#3A3A3A')};
  text-align: left;
`;

/* 하트 모달 전용 스타일 */
const HeartModalContent = styled(ModalContent)`
  max-width: 320px;
  padding: 32px 24px 24px 24px;
`;

const HeartIconBubble = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #FFFEE0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(254, 250, 224, 0.5);

  svg {
    width: 44px;
    height: 40px;
    fill: #C5251A;
  }
`;

const HeartDesc = styled.p`
  font-size: 13.5px;
  line-height: 1.6;
  color: #4E3F30;
  text-align: center;
  margin: 0 0 28px 0;
  word-break: keep-all;

  strong {
    color: #C5251A;
  }
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

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [levelTab, setLevelTab] = useState<'my' | 'all'>('my');

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      isModalOpen: isLevelModalOpen || isHeartModalOpen,
    });
  }, [isLevelModalOpen, isHeartModalOpen, setHeaderConfig]);

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
      navigate('/mypage/customer-service');
    } else if (menuId === 'menu-notification') {
      navigate('/mypage/notification-settings');
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
            onClick={() => { setIsLevelModalOpen(true); setLevelTab('my'); }}
            aria-label="레벨 정보 조회"
          >
            Lv.12 포근한 정원사
          </BadgeButton>
          <BadgeButton
            $type="heart"
            onClick={() => setIsHeartModalOpen(true)}
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

      {/* 1. 나의 성장 레벨 모달 */}
      {isLevelModalOpen && (
        <ModalOverlay onClick={() => setIsLevelModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setIsLevelModalOpen(false)} aria-label="닫기">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </ModalCloseButton>
            
            <ModalTitle>나의 성장 레벨</ModalTitle>
            
            <TabBar>
              <TabButton $active={levelTab === 'my'} onClick={() => setLevelTab('my')}>
                내 레벨
              </TabButton>
              <TabButton $active={levelTab === 'all'} onClick={() => setLevelTab('all')}>
                전체 레벨
              </TabButton>
            </TabBar>

            {levelTab === 'my' ? (
              /* 내 레벨 탭 컨텐츠 */
              <>
                <ImageWrapper>
                  <MascotImg src={mongHappy} alt="몽이 해피 캐릭터" />
                </ImageWrapper>

                <LevelBadge>
                  <span>★ Lv.12 포근한 정원사</span>
                </LevelBadge>

                <LevelDesc>
                  {`생활비를 기록하고 비서와 대화하면\n레벨이 올라가요! 레벨 100이 되면\n전설의 자취 마스터가 될 수 있어요!`}
                </LevelDesc>

                <ProgressInfo>
                  <span>Lv.12</span>
                  <span style={{ color: '#4A7ABA' }}>Lv.13까지 450xp</span>
                </ProgressInfo>
                <ProgressBarContainer>
                  <ProgressBarFill />
                </ProgressBarContainer>

                <div style={{ textAlign: 'left', fontSize: '13px', fontWeight: 'bold', color: '#21160F', marginBottom: '12px' }}>
                  ↑ 다음 성장 목표
                </div>

                <GoalsGrid>
                  <GoalCard>
                    <GoalIcon>✈</GoalIcon>
                    <GoalText>우주를 누비는 붕어빵</GoalText>
                  </GoalCard>
                  <GoalCard>
                    <GoalIcon>☁</GoalIcon>
                    <GoalText>노래하는 무지개 연금술사</GoalText>
                  </GoalCard>
                  <GoalCard>
                    <GoalIcon>🧹</GoalIcon>
                    <GoalText>춤추는 초코파이 기사</GoalText>
                  </GoalCard>
                  <GoalCard>
                    <GoalIcon>🏆</GoalIcon>
                    <GoalText>명상하는 솜사탕 탐험가</GoalText>
                  </GoalCard>
                </GoalsGrid>
              </>
            ) : (
              /* 전체 레벨 탭 컨텐츠 */
              <LevelListContainer>
                {[
                  { lv: 1, name: '잠자는 무지개 요정' },
                  { lv: 2, name: '춤추는 솜사탕 기사' },
                  { lv: 3, name: '노래하는 젤리 탐험가' },
                  { lv: 4, name: '빛나는 마카롱 연금술사' },
                  { lv: 5, name: '명상하는 붕어빵 마법사' },
                  { lv: 6, name: '날아가는 초코파이 전사' },
                  { lv: 7, name: '꿈꾸는 구름 정원사' },
                  { lv: 8, name: '달콤한 별빛 요리사' },
                  { lv: 9, name: '신비한 우주 항해사' },
                  { lv: 10, name: '투명한 바다 시인' },
                  { lv: 11, name: '포근한 바람 화가' },
                  { lv: 12, name: '노래하는 식빵 기사 (현재)', isCurrent: true },
                  { lv: 13, name: '용감한 치즈 조각가' },
                  { lv: 999, name: '중간 레벨 생략', isSpacer: true },
                  { lv: 100, name: '전설의 은하수 마스터' }
                ].map((item, idx) => (
                  item.isSpacer ? (
                    <LevelRow key={idx} $isCurrent={false} style={{ justifyContent: 'center', backgroundColor: '#FFFDF0', border: '1px dashed #E5DCC4' }}>
                      <LevelRowName $isCurrent={false} style={{ color: '#8C8273' }}>
                        ... 중간 레벨 생략 ...
                      </LevelRowName>
                    </LevelRow>
                  ) : (
                    <LevelRow key={idx} $isCurrent={!!item.isCurrent}>
                      <LevelNumberCircle $isCurrent={!!item.isCurrent}>
                        {item.lv}
                      </LevelNumberCircle>
                      <LevelRowName $isCurrent={!!item.isCurrent}>
                        {item.name}
                      </LevelRowName>
                    </LevelRow>
                  )
                ))}
              </LevelListContainer>
            )}

            <ModalConfirmButton onClick={() => setIsLevelModalOpen(false)}>
              확인
            </ModalConfirmButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 2. 나의 따뜻한 하트 모달 */}
      {isHeartModalOpen && (
        <ModalOverlay onClick={() => setIsHeartModalOpen(false)}>
          <HeartModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setIsHeartModalOpen(false)} aria-label="닫기">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </ModalCloseButton>

            <HeartIconBubble>
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </HeartIconBubble>

            <ModalTitle style={{ fontSize: '18px', color: '#21160F', marginBottom: '16px' }}>나의 따뜻한 하트</ModalTitle>
            
            <HeartDesc>
              {`하트는 비서 말랑이와 대화하고 생활비를\n꼼꼼히 기록하면 모을 수 있어요!\n\n하트가 많아질수록 말랑이와 더 친해지고\n방을 꾸밀 수 있는 특별한 아이템을\n선물받을 수 있답니다.`}
            </HeartDesc>

            <ModalConfirmButton $colorType="red" onClick={() => setIsHeartModalOpen(false)}>
              확인
            </ModalConfirmButton>
          </HeartModalContent>
        </ModalOverlay>
      )}
    </MypageMain>
  );
};

export default MyPage;
