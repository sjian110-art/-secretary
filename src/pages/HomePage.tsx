import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import waterIconImg from '../assets/icons/water.png';
import sproutImg from '../assets/spring/sprout_idle.png';

const waterFlow = keyframes`
  0% {
    height: 0;
    opacity: 0;
  }
  12%, 78% {
    height: 56px;
    opacity: 0.95;
  }
  100% {
    height: 0;
    opacity: 0;
  }
`;

const waterDrop = keyframes`
  0% {
    transform: translateY(0) scale(0.65);
    opacity: 0;
  }
  15%, 85% {
    opacity: 1;
  }
  100% {
    transform: translateY(82px) scale(1);
    opacity: 0;
  }
`;

const sproutBounce = keyframes`
  0%, 100% {
    transform: translateX(-50%) translateY(0) scaleY(1);
  }
  22% {
    transform: translateX(-50%) translateY(-20px) scaleY(1.02);
  }
  40% {
    transform: translateX(-50%) translateY(0) scaleY(0.96);
  }
  62% {
    transform: translateX(-50%) translateY(-10px) scaleY(1.01);
  }
  78% {
    transform: translateX(-50%) translateY(0) scaleY(0.98);
  }
`;

const HomeMain = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - ${({ theme }) => theme.size.headerHeight});
  min-height: 540px;
  overflow: hidden;
`;

const WaterAction = styled.div`
  position: absolute;
  top: 13%;
  left: 0;
  width: 180px;
  height: 170px;

  @media (max-height: 760px) {
    top: 8%;
  }
`;

const WaterBubbleBtn = styled.button<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 40px;
  width: 130px;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textWhite};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 22px;
  letter-spacing: 1px;
  transition:
    transform ${({ theme }) => theme.transition.fast},
    background-color ${({ theme }) => theme.transition.default};

  &:hover {
    background-color: #95BC8B;
  }

  &::after {
    content: '';
    position: absolute;
    left: 32px;
    bottom: -18px;
    width: 40px;
    height: 28px;
    background: ${({ theme }) => theme.colors.primary};
    clip-path: polygon(0 0, 100% 0, 0 100%);
    border-radius: 0 0 0 6px;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      transform: scale(0.96);
    `}

  @media (max-width: 380px) {
    left: 28px;
    width: 118px;
    height: 70px;
    font-size: 20px;
  }
`;

const WaterIcon = styled.span`
  width: 22px;
  height: 26px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.textWhite};
  }
`;

const FaucetIcon = styled.button`
  position: absolute;
  top: 92px;
  left: 10px;
  width: 52px;
  height: 52px;
  overflow: visible;
  transition: transform ${({ theme }) => theme.transition.fast};

  &:active {
    transform: scale(0.94);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 2;
  }
`;

const WaterStream = styled.span<{ $isRunning: boolean }>`
  position: absolute;
  top: 42px;
  left: 44px;
  width: 4px;
  height: 0;
  border-radius: 0 0 7px 7px;
  background: linear-gradient(90deg, #91D9F5, #D8F7FF 48%, #68C6EB);
  opacity: 0;
  transform-origin: top;
  z-index: 1;

  ${({ $isRunning }) =>
    $isRunning &&
    css`
      animation: ${waterFlow} 1.5s ease-in-out;
    `}
`;

const WaterDrop = styled.span<{ $isRunning: boolean; $delay?: string }>`
  position: absolute;
  top: 45px;
  left: 43px;
  width: 7px;
  height: 10px;
  border-radius: 55% 55% 60% 60%;
  background: #87D7F4;
  opacity: 0;
  clip-path: polygon(50% 0, 100% 58%, 88% 88%, 50% 100%, 12% 88%, 0 58%);
  z-index: 1;

  ${({ $isRunning, $delay }) =>
    $isRunning &&
    css`
      animation: ${waterDrop} 0.72s ease-in infinite;
      animation-delay: ${$delay || '0s'};
    `}
`;

const SproutWrapper = styled.button<{ $isBouncing: boolean }>`
  position: absolute;
  top: 37%;
  left: 50%;
  width: min(54vw, 260px);
  aspect-ratio: 1;
  transform: translateX(-50%);
  transform-origin: 50% 90%;
  overflow: visible;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  ${({ $isBouncing }) =>
    $isBouncing &&
    css`
      animation: ${sproutBounce} 0.62s ease-out;
    `}

  @media (max-height: 760px) {
    top: 31%;
    width: min(48vw, 230px);
  }

  @media (max-width: 380px) {
    width: 58vw;
  }
`;

const StatusCard = styled.section`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  bottom: ${({ theme }) => theme.spacing[3]};
  min-height: 102px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid #EFDDEB;
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: #FFF0FA;
  box-shadow: ${({ theme }) => theme.shadow.default};

  @media (max-height: 760px) {
    min-height: 88px;
    padding-block: ${({ theme }) => theme.spacing[2]};
  }

  @media (max-width: 380px) {
    left: ${({ theme }) => theme.spacing[2]};
    right: ${({ theme }) => theme.spacing[2]};
    padding-inline: ${({ theme }) => theme.spacing[2]};
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const StatusIcon = styled.div`
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;
  background: #FFF39B;

  svg {
    width: 34px;
    height: 34px;
  }

  path:first-child {
    fill: #7D4B05;
  }

  path:last-child {
    stroke: ${({ theme }) => theme.colors.textWhite};
    stroke-width: 1.2;
    stroke-linecap: round;
    opacity: 0.5;
  }

  @media (max-height: 760px) {
    width: 50px;
    height: 50px;
    flex-basis: 50px;
  }
`;

const StatusContent = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatusTitle = styled.h3`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1px;

  @media (max-height: 760px) {
    font-size: 18px;
  }

  @media (max-width: 380px) {
    font-size: 17px;
  }
`;

const StatusDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 17px;
  white-space: nowrap;

  @media (max-height: 760px) {
    font-size: 16px;
  }

  @media (max-width: 380px) {
    font-size: 15px;
  }
`;

export const HomePage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const [isRunning, setIsRunning] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    // Overriding Header on the Home screen to trigger alert dialog on notification click
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });
  }, [setHeaderConfig]);

  const handleWaterClick = () => {
    if (isRunning) return;
    setIsRunning(true);

    setTimeout(() => {
      setIsRunning(false);
    }, 1600);
  };

  const handleSproutClick = () => {
    setIsBouncing(false);
    // Trigger reflow to restart css animation
    setTimeout(() => {
      setIsBouncing(true);
    }, 10);
  };

  const handleAnimationEnd = () => {
    setIsBouncing(false);
  };

  return (
    <HomeMain>
      <WaterAction>
        <WaterBubbleBtn
          onClick={handleWaterClick}
          $isActive={isRunning}
          disabled={isRunning}
          type="button"
        >
          <WaterIcon>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C12 2 5 11.2 5 15.6C5 19.7 8.1 22 12 22C15.9 22 19 19.7 19 15.6C19 11.2 12 2 12 2Z" />
            </svg>
          </WaterIcon>
          <span>물 주기</span>
        </WaterBubbleBtn>

        <FaucetIcon
          onClick={handleWaterClick}
          disabled={isRunning}
          aria-label="수도꼭지를 눌러 물 주기"
          type="button"
        >
          <img src={waterIconImg} alt="" />
          <WaterStream $isRunning={isRunning} className="water-stream" aria-hidden="true" />
          <WaterDrop $isRunning={isRunning} className="water-drop" aria-hidden="true" />
          <WaterDrop $isRunning={isRunning} $delay="0.22s" className="water-drop" aria-hidden="true" />
          <WaterDrop $isRunning={isRunning} $delay="0.44s" className="water-drop" aria-hidden="true" />
        </FaucetIcon>
      </WaterAction>

      <SproutWrapper
        onClick={handleSproutClick}
        $isBouncing={isBouncing}
        onAnimationEnd={handleAnimationEnd}
        aria-label="새싹 통통 튀기"
        type="button"
      >
        <img src={sproutImg} alt="봄 새싹" />
      </SproutWrapper>

      <StatusCard aria-labelledby="status-title">
        <StatusIcon>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20C4 12 10 4 20 4C20 14 12 20 4 20Z" />
            <path d="M6.5 17.5C10.2 13.8 13.8 10.2 17.5 6.5" />
          </svg>
        </StatusIcon>
        <StatusContent>
          <StatusTitle id="status-title">새싹의 기분</StatusTitle>
          <StatusDesc>목이 조금 말라요, 시원한 물을 주세요!</StatusDesc>
        </StatusContent>
      </StatusCard>
    </HomeMain>
  );
};
export default HomePage;
