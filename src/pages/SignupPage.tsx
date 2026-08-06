import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Input } from '../components/Input';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.cream};
  min-height: 100vh;
`;

const SignupHeader = styled.header`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]} 0`};
`;

const ProgressSteps = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ProgressTrack = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 4px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    height: 3px;
    background-color: ${({ theme }) => theme.colors.gray300};
    border-radius: ${({ theme }) => theme.radius.pill};
    z-index: 0;
  }
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 3px;
  width: 50%; /* Represents Step 1 -> Step 2 transition state */
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.pill};
  z-index: 1;
  transition: width ${({ theme }) => theme.transition.slow};
`;

const ProgressDot = styled.div<{ $status: 'done' | 'active' | 'pending' }>`
  position: relative;
  z-index: 2;
  width: 12px;
  height: 12px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background-color: ${({ theme }) => theme.colors.gray300};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  flex-shrink: 0;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    border-color ${({ theme }) => theme.transition.default};

  ${({ $status, theme }) =>
    $status === 'done' &&
    css`
      background-color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
    `}

  ${({ $status, theme }) =>
    $status === 'active' &&
    css`
      width: 18px;
      height: 18px;
      background-color: ${theme.colors.primaryDark};
      border-color: ${theme.colors.primaryDark};
      box-shadow: 0 0 0 4px rgba(92, 138, 76, 0.18);
    `}
`;

const StepLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StepLabel = styled.span<{ $isActive?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 400)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primaryDark : theme.colors.textSub};
  letter-spacing: -0.2px;
  line-height: 1;
`;

const SignupMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  flex: 1;
`;

const SignupIntro = styled.section`
  padding-top: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
`;

const SignupTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primaryDark};
  letter-spacing: -0.5px;
  line-height: 1.3;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SignupDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  line-height: 1.65;
  letter-spacing: -0.2px;
`;

const SignupFormWrap = styled.section`
  width: 100%;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const SecurityCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background-color: #F7F0C4;
  border-radius: ${({ theme }) => theme.radius.cardSm};
  padding: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SecurityIcon = styled.div`
  width: 44px;
  height: 44px;
  background-color: #FFFDE8;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SecurityText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const SecurityTitle = styled.strong`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryDark};
  letter-spacing: -0.2px;
  display: block;
`;

const SecurityDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  line-height: 1.6;
  letter-spacing: -0.1px;
`;

const BtnNext = styled.button`
  width: 100%;
  height: ${({ theme }) => theme.size.btnHeight};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.btn};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textWhite};
  letter-spacing: 0.5px;
  box-shadow: 0 4px 0 ${({ theme }) => theme.colors.primaryDeep};
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    opacity ${({ theme }) => theme.transition.default};

  &:disabled {
    background-color: #C8D8C0;
    box-shadow: 0 4px 0 #AABEA0;
    color: rgba(255, 255, 255, 0.65);
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    background-color: #95BC8B;
  }

  &:not(:disabled):active {
    transform: translateY(4px);
    box-shadow: 0 0 0 ${({ theme }) => theme.colors.primaryDeep};
    background-color: #78A06E;
  }
`;

const BtnNextText = styled.span`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const BtnNextArrow = styled.span`
  font-size: 18px;
  line-height: 1;
  margin-top: 1px;
`;

const SignupFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding-bottom: ${({ theme }) => theme.spacing[1]};
`;

const SignupFooterText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
`;

const SignupLoginLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryDark};
  letter-spacing: -0.2px;
  transition: opacity ${({ theme }) => theme.transition.default};

  &:hover {
    opacity: 0.75;
  }
`;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  useEffect(() => {
    const allFilled = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;
    setIsBtnDisabled(!allFilled);
  }, [name, email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBtnDisabled) return;

    console.log('Step 1 Complete');
    navigate('/login');
  };

  return (
    <SignupContainer>
      <SignupHeader>
        <ProgressSteps
          role="progressbar"
          aria-valuenow={1}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label="회원가입 진행 단계"
        >
          <ProgressTrack>
            <ProgressFill />
            <ProgressDot $status="done" id="dot-1" aria-label="1단계 완료" />
            <ProgressDot $status="active" id="dot-2" aria-label="현재 2단계: 목표 설정" />
            <ProgressDot $status="pending" id="dot-3" aria-label="3단계: 완료" />
          </ProgressTrack>
          <StepLabels aria-hidden="true">
            <StepLabel $isActive={true}>시작하기</StepLabel>
            <StepLabel>목표 설정</StepLabel>
            <StepLabel>완료</StepLabel>
          </StepLabels>
        </ProgressSteps>
      </SignupHeader>

      <SignupMain>
        <SignupIntro aria-labelledby="signup-title">
          <SignupTitle id="signup-title">함께  시작해볼까요?</SignupTitle>
          <SignupDesc>
            말랑말랑한 가계부 생활을 위해
            <br />
            몇 가지 정보가 필요해요.
          </SignupDesc>
        </SignupIntro>

        <SignupFormWrap aria-label="회원가입 입력 폼">
          <SignupForm onSubmit={handleSubmit} noValidate>
            <Input
              label="이름 (또는 닉네임)"
              id="input-name"
              type="text"
              placeholder="어떻게 불러드릴까요?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoComplete="nickname"
            />

            <Input
              label="이메일 주소"
              id="input-email"
              type="email"
              placeholder="example@mallang.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={60}
              autoComplete="email"
            />

            <Input
              label="비밀번호"
              id="input-pw"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={30}
              autoComplete="new-password"
            />

            <SecurityCard aria-label="보안 안내">
              <SecurityIcon aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2L16.5 9H24L18 13.5L20.5 20.5L14 16L7.5 20.5L10 13.5L4 9H11.5L14 2Z" fill="#5C8A4C" opacity="0.15" />
                  <path d="M14 4.5C14 4.5 11 10 6 10.5C6 10.5 7 20 14 23C21 20 22 10.5 22 10.5C17 10 14 4.5 14 4.5Z" stroke="#5C8A4C" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  <path d="M10.5 13.5L13 16L17.5 11.5" stroke="#5C8A4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </SecurityIcon>
              <SecurityText>
                <SecurityTitle>안전한 데이터 보호</SecurityTitle>
                <SecurityDesc>
                  회원님의 소중한 금융 정보는
                  <br />
                  암호화되어 안전하게 보관됩니다.
                </SecurityDesc>
              </SecurityText>
            </SecurityCard>

            <BtnNext type="submit" disabled={isBtnDisabled} aria-disabled={isBtnDisabled}>
              <BtnNextText className="btn-next-text">다음으로</BtnNextText>
              <BtnNextArrow aria-hidden="true" className="btn-next-arrow">→</BtnNextArrow>
            </BtnNext>
          </SignupForm>
        </SignupFormWrap>

        <SignupFooter>
          <SignupFooterText>
            이미 계정이 있으신가요?&nbsp;
            <SignupLoginLink to="/login" id="link-go-login">로그인</SignupLoginLink>
          </SignupFooterText>
        </SignupFooter>
      </SignupMain>
    </SignupContainer>
  );
};
export default SignupPage;
