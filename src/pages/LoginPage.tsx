import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import mongCurious from '../assets/mascot/mong_curious.png';
import logoImg from '../assets/images/logo_img.png';
import logoText from '../assets/images/logo.png';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: ${({ theme }) => theme.spacing[5]};
  background-color: ${({ theme }) => theme.colors.cream};
  min-height: 100vh;
`;

const LoginHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 56px;
  padding-bottom: ${({ theme }) => theme.spacing[1]};
`;

const MascotWrap = styled.div`
  position: relative;
  width: 194px;
  height: 194px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MascotImg = styled.img`
  width: 170px;
  height: auto;
  object-fit: contain;
`;

const MascotBadge = styled.div`
  position: absolute;
  bottom: 16px;
  right: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MascotBadgeImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.circle};
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const MascotBadgeLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryDark};
  background-color: ${({ theme }) => theme.colors.yellow};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 2px ${({ theme }) => theme.spacing[1]};
  margin-top: 2px;
  letter-spacing: -0.2px;
  line-height: 1.6;
`;

const BrandWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const BrandLogo = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
`;

const BrandSlogan = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
`;

const LoginMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} 0`};
  flex: 1;
`;

const LoginCard = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  box-shadow: ${({ theme }) => theme.shadow.default};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[4]}`};
`;

const LoginForm = styled.form``;

const LoginLinks = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LoginLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
  transition: color ${({ theme }) => theme.transition.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LinkDot = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  line-height: 1;
`;

const SocialLogin = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[5]};
`;

const SocialDivider = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray300};
  }
`;

const SocialDividerLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  padding: 0 ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
`;

const SocialBtnWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SocialBtn = styled.button<{ $type: 'kakao' | 'apple' | 'google' }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform ${({ theme }) => theme.transition.default},
    opacity ${({ theme }) => theme.transition.default};
  flex-shrink: 0;

  &:hover {
    transform: scale(1.07);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }

  background-color: ${({ $type, theme }) => {
    if ($type === 'kakao') return theme.colors.yellow;
    if ($type === 'apple') return '#1A1A1A';
    return theme.colors.surface;
  }};

  border: ${({ $type, theme }) =>
    $type === 'google' ? `1.5px solid ${theme.colors.gray300}` : 'none'};
  box-shadow: ${({ $type, theme }) =>
    $type === 'google' ? theme.shadow.sm : 'none'};
`;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorId, setErrorId] = useState('');
  const [errorPw, setErrorPw] = useState('');

  const handleFocusId = () => setErrorId('');
  const handleFocusPw = () => setErrorPw('');

  const handleInputChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);
    if (value.trim()) setErrorId('');
  };

  const handleInputChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim()) setErrorPw('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!userId.trim()) {
      setErrorId('아이디를 입력해주세요.');
      hasError = true;
    } else {
      setErrorId('');
    }

    if (!password.trim()) {
      setErrorPw('비밀번호를 입력해주세요.');
      hasError = true;
    } else {
      setErrorPw('');
    }

    if (!hasError) {
      console.log('Login Success');
      // Redirect to Main Home
      navigate('/home');
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <MascotWrap>
          <MascotImg src={mongCurious} alt="말랑이 캐릭터" />
          <MascotBadge>
            <MascotBadgeImg src={logoImg} alt="몽이 아이콘" />
            <MascotBadgeLabel>몽이</MascotBadgeLabel>
          </MascotBadge>
        </MascotWrap>

        <BrandWrap>
          <BrandLogo src={logoText} alt="말랑말랑 로고" />
          <BrandSlogan>당신의 다정한 가계부 비서</BrandSlogan>
        </BrandWrap>
      </LoginHeader>

      <LoginMain>
        <LoginCard aria-label="로그인 폼">
          <LoginForm onSubmit={handleSubmit} noValidate>
            <Input
              label="아이디"
              id="input-id"
              type="text"
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={handleInputChangeId}
              onFocus={handleFocusId}
              error={errorId}
              maxLength={30}
              autoComplete="username"
            />

            <Input
              label="비밀번호"
              id="input-pw"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={handleInputChangePw}
              onFocus={handleFocusPw}
              error={errorPw}
              maxLength={30}
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="full" style={{ marginTop: '16px' }}>
              로그인
            </Button>
          </LoginForm>

          <LoginLinks aria-label="계정 관련 링크">
            <LoginLink to="/signup">회원가입</LoginLink>
            <LinkDot aria-hidden="true">•</LinkDot>
            <LoginLink to="#">비밀번호 찾기</LoginLink>
          </LoginLinks>
        </LoginCard>

        <SocialLogin aria-label="간편 로그인">
          <SocialDivider>
            <SocialDividerLabel>간편 로그인</SocialDividerLabel>
          </SocialDivider>

          <SocialBtnWrap>
            <SocialBtn
              type="button"
              $type="kakao"
              aria-label="카카오로 로그인"
              onClick={() => navigate('/home')}
            >
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true">
                <path
                  d="M11 0C4.925 0 0 3.761 0 8.4c0 3.003 1.998 5.637 5.01 7.14L3.77 19.42a.42.42 0 0 0 .626.45L9.64 16.7c.449.054.91.082 1.36.082 6.075 0 11-3.761 11-8.4C22 3.761 17.075 0 11 0z"
                  fill="#3A1D1D"
                />
              </svg>
            </SocialBtn>

            <SocialBtn
              type="button"
              $type="apple"
              aria-label="애플로 로그인"
              onClick={() => navigate('/home')}
            >
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
                <path
                  d="M16.52 12.74c-.02-2.56 2.09-3.8 2.19-3.87-1.2-1.75-3.06-1.99-3.72-2.01-1.58-.16-3.09.93-3.89.93-.8 0-2.03-.91-3.34-.89-1.72.03-3.31 1-4.19 2.54-1.79 3.1-.46 7.69 1.29 10.21.86 1.23 1.88 2.62 3.22 2.57 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.82 1.39-.02 2.27-1.26 3.12-2.5.99-1.43 1.39-2.82 1.41-2.89-.03-.02-2.7-1.03-2.73-4.07zM14.1 4.53C14.8 3.67 15.28 2.48 15.14 1.3c-1.03.04-2.27.69-3 1.53-.66.76-1.24 1.97-1.08 3.14 1.14.09 2.3-.58 3.04-1.44z"
                  fill="#FFFFFF"
                />
              </svg>
            </SocialBtn>

            <SocialBtn
              type="button"
              $type="google"
              aria-label="구글로 로그인"
              onClick={() => navigate('/home')}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path
                  d="M21.14 11.25c0-.76-.07-1.5-.19-2.21H11v4.18h5.7a4.87 4.87 0 0 1-2.11 3.2v2.66h3.42c2-1.84 3.13-4.55 3.13-7.83z"
                  fill="#4285F4"
                />
                <path
                  d="M11 22c2.87 0 5.27-.95 7.02-2.58l-3.42-2.66c-.95.64-2.17 1.01-3.6 1.01-2.77 0-5.11-1.87-5.95-4.38H1.53v2.75A11 11 0 0 0 11 22z"
                  fill="#34A853"
                />
                <path
                  d="M5.05 13.39A6.6 6.6 0 0 1 4.7 11c0-.83.14-1.63.35-2.39V5.86H1.53A11 11 0 0 0 0 11c0 1.78.43 3.46 1.53 4.86l3.52-2.47z"
                  fill="#FBBC05"
                />
                <path
                  d="M11 4.36c1.56 0 2.96.54 4.06 1.59l3.05-3.05C16.27.95 13.87 0 11 0A11 11 0 0 0 1.53 5.86l3.52 2.75C5.89 6.23 8.23 4.36 11 4.36z"
                  fill="#EA4335"
                />
              </svg>
            </SocialBtn>
          </SocialBtnWrap>
        </SocialLogin>
      </LoginMain>
    </LoginContainer>
  );
};
export default LoginPage;
