import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import splashBlur from '../assets/images/splash_blur.png';
import splashGlow from '../assets/images/Splash Glow background for Mascot.png';
import mascotDefault from '../assets/mascot/mong_default.png';
import logoSplash from '../assets/images/logo_splash.png';

const SplashScreen = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 620px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.cream};
  font-family: ${({ theme }) => theme.fonts.serif};
`;

const SplashBackground = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const SplashContent = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const MascotArea = styled.div`
  position: absolute;
  top: 24%;
  left: 50%;
  width: min(61vw, 294px);
  aspect-ratio: 1.025;
  transform: translateX(-50%);
  display: grid;
  place-items: start center;

  @media (max-height: 700px) {
    top: 20%;
    width: min(54vw, 250px);
  }
`;

const MascotGlow = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const SplashMascot = styled.img`
  position: relative;
  width: min(29vw, 139px);
  height: auto;
  margin-top: min(2.2vw, 11px);
  object-fit: contain;
  filter: drop-shadow(0 8px 8px rgba(70, 45, 30, 0.14));
`;

const BrandArea = styled.div`
  position: absolute;
  top: 49%;
  left: 50%;
  width: 82%;
  transform: translateX(-50%);
  text-align: center;

  @media (max-height: 700px) {
    top: 47%;
  }
`;

const SplashLogo = styled.img`
  display: block;
  width: min(44vw, 213px);
  height: auto;
  margin: 0 auto ${({ theme }) => theme.spacing[1]};
  object-fit: contain;
`;

const SplashSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: clamp(13px, 3.5vw, 17px);
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: -0.5px;
`;

const LoadingArea = styled.div`
  position: absolute;
  top: 66%;
  left: 50%;
  width: min(48vw, 230px);
  transform: translateX(-50%);
  text-align: center;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: clamp(12px, 3.1vw, 15px);
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.gray300};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 2.3s ease-in-out;
`;

const LoadingText = styled.p`
  margin-top: clamp(20px, 4.5vw, 27px);
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(12px, 3.1vw, 15px);
  font-weight: 400;
  letter-spacing: -0.4px;
`;

const SplashCopyright = styled.p`
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: max(18px, 2.8%);
  width: 100%;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: clamp(10px, 2.5vw, 12px);
  text-align: center;
`;

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill the progress bar after 80ms
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 80);

    // Redirect to login (or home) after 2500ms
    const redirectTimer = setTimeout(() => {
      // In a real application, checking login status and routing would be handled here.
      // We default to /login to showcase the login and onboarding flow.
      navigate('/login');
    }, 2500);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <SplashScreen>
      <SplashBackground src={splashBlur} alt="" />
      <SplashContent aria-label="앱을 불러오는 중">
        <MascotArea>
          <MascotGlow src={splashGlow} alt="" />
          <SplashMascot src={mascotDefault} alt="말랑말랑 마스코트 몽이" />
        </MascotArea>

        <BrandArea>
          <SplashLogo src={logoSplash} alt="말랑말랑 자취비서" />
          <SplashSubtitle>
            당신의 소중한 자취 생활을 기록하는
            <br />
            폭신폭신한 고지서 도우미
          </SplashSubtitle>
        </BrandArea>

        <LoadingArea>
          <ProgressTrack
            role="progressbar"
            aria-label="로딩 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <ProgressFill $progress={progress} />
          </ProgressTrack>
          <LoadingText aria-live="polite">조금만 기다려주세요...</LoadingText>
        </LoadingArea>
      </SplashContent>
      <SplashCopyright>COPYRIGHT © 2026. 이지연. ALL RIGHTS</SplashCopyright>
    </SplashScreen>
  );
};
export default SplashPage;
