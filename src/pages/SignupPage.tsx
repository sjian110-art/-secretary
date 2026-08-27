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
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackBtn = styled.button`
  background: none;
  border: 0;
  font-size: 24px;
  color: #21160F;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 24px;
  height: 24px;
`;

const ProgressSteps = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

/* 시안의 3단 분할 progress bar */
const ProgressTrack = styled.div`
  display: flex;
  width: 100%;
  height: 6px;
  gap: 6px;
`;

const ProgressSegment = styled.div<{ $status: 'done' | 'active' | 'pending' }>`
  flex: 1;
  height: 100%;
  border-radius: 3px;
  transition: background-color ${({ theme }) => theme.transition.default};

  ${({ $status }) =>
    $status === 'done' &&
    css`
      background-color: #A2C09F; /* 연한 초록 */
    `}

  ${({ $status }) =>
    $status === 'active' &&
    css`
      background-color: #2B4C20; /* 짙은 초록 (현재 활성화된 단계) */
    `}

  ${({ $status }) =>
    $status === 'pending' &&
    css`
      background-color: #E2DCBF; /* 비활성화 대기 */
    `}
`;

const StepLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2px;
`;

const StepLabel = styled.span<{ $isActive?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 400)};
  color: ${({ theme, $isActive }) =>
    $isActive ? '#2B4C20' : theme.colors.textSub};
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
  font-family: 'Jua', sans-serif;
  font-size: 26px;
  font-weight: bold;
  color: #2B4C20;
  letter-spacing: -0.5px;
  line-height: 1.3;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SignupDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
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
    box-shadow ${({ theme }) => theme.transition.fast};

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

/* ========================================================
   2단계: 목표 설정 화면 전용 Styled Components
   ======================================================== */
const GoalSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const GoalInputWrapper = styled.div`
  background-color: #FFFDF5;
  border-radius: 28px;
  height: 64px;
  border: 1px solid #ECE7D4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
`;

const GoalInput = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 26px;
  font-weight: 800;
  color: #21160F;
  width: 100%;
  text-align: right;

  &::placeholder {
    color: #C4C0B4;
  }
`;

const GoalUnit = styled.span`
  font-family: 'Jua', sans-serif;
  font-size: 20px;
  color: #21160F;
  font-weight: bold;
`;

const StanceLabel = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  color: #2B4C20;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const StanceGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
`;

const StanceCircleBtn = styled.button<{ $isActive: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #FFFDF5;
  border: 1.5px solid #ECE7D4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $isActive }) =>
    $isActive &&
    css`
      border: 2.5px solid #2B4C20; /* 짙은 녹색 활성 테두리 */
      box-shadow: 0 4px 12px rgba(43, 76, 32, 0.15);
    `}
`;

const StanceIconWrap = styled.div<{ $bgColor: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StanceText = styled.span`
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 13px;
  font-weight: 700;
  color: #5C524B;
  text-align: center;
  line-height: 1.2;
`;

const TipCard = styled.div`
  background-color: #FFF9E3; /* 연노랑 안내 팁 */
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(255, 249, 227, 0.3);
`;

const TipIcon = styled.span`
  color: #FFC000;
  font-size: 20px;
`;

const TipText = styled.p`
  color: #7D5B18;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
`;

const BtnComplete = styled.button`
  width: 100%;
  height: 52px;
  background-color: #83AC80; /* 시안 연녹색 버튼 */
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  box-shadow: 0 4px 0 #6C8E69;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background-color: #749A71;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #6C8E69;
  }
`;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // 회원가입 단계 (1 = 시작 정보 입력, 2 = 목표 설정)
  const [step, setStep] = useState(1);

  // 1단계 상태값
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  // 2단계 상태값 (목표 설정)
  const [budgetVal, setBudgetVal] = useState('1,000,000');
  const [selectedStance, setSelectedStance] = useState('허리띠 졸라매기');

  useEffect(() => {
    const allFilled = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;
    setIsBtnDisabled(!allFilled);
  }, [name, email, password]);

  // 1단계 제출 시 -> 2단계 목표 설정으로 변경
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBtnDisabled) return;
    setStep(2);
  };

  // 2단계 완료 시 -> 로컬스토리지 저장 및 완료 페이지/로그인으로 이동
  const handleGoalSubmit = () => {
    const cleanBudget = Number(budgetVal.replace(/[^\d]/g, ''));
    if (!cleanBudget || cleanBudget === 0) {
      window.alert('올바른 목표 예산을 입력해주세요.');
      return;
    }

    // 예산 및 생활 스탠스 저장
    localStorage.setItem('budget', String(cleanBudget));
    localStorage.setItem('attitude', selectedStance);
    
    // 초기 보증금/저금액 셋업 (챌린지 페이지 연동 등)
    if (!localStorage.getItem('challenge_savings')) {
      localStorage.setItem('challenge_savings', '450000');
    }

    window.alert('회원가입 및 목표 설정이 완료되었습니다! 로그인해주세요.');
    console.log('Signup and Goal Setup Complete');
    navigate('/login');
  };

  const handleBudgetChange = (val: string) => {
    const rawValue = val.replace(/[^\d]/g, '');
    setBudgetVal(rawValue ? Number(rawValue).toLocaleString('ko-KR') : '');
  };

  const stancesList = [
    { name: '허리띠 졸라매기', emoji: '🐖', color: '#FFEAEF' },
    { name: '바지 꽉 잠궈입기', emoji: '🔒', color: '#FFF0E4' },
    { name: '평소처럼 유지', emoji: '🏠', color: '#EBF4FF' },
    { name: '트레이닝 팬츠 입기', emoji: '🛋️', color: '#EAF5EA' },
    { name: '여유롭게 즐기기', emoji: '✨', color: '#F3E8FF' },
  ];

  return (
    <SignupContainer id="signup-screen">
      <SignupHeader>
        {step === 2 && (
          <BackBtn type="button" onClick={() => setStep(1)} aria-label="이전 단계로 돌아가기">
            ←
          </BackBtn>
        )}
        <ProgressSteps
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label="회원가입 진행 단계"
        >
          {/* 가로 세그먼트 형태의 progress bar */}
          <ProgressTrack>
            <ProgressSegment $status={step >= 1 ? 'done' : 'pending'} />
            <ProgressSegment $status={step === 2 ? 'active' : step > 2 ? 'done' : 'pending'} />
            <ProgressSegment $status={step === 3 ? 'active' : 'pending'} />
          </ProgressTrack>
          <StepLabels aria-hidden="true">
            <StepLabel $isActive={step === 1}>시작하기</StepLabel>
            <StepLabel $isActive={step === 2}>목표 설정</StepLabel>
            <StepLabel $isActive={step === 3}>완료</StepLabel>
          </StepLabels>
        </ProgressSteps>
      </SignupHeader>

      <SignupMain>
        {step === 1 ? (
          /* ========================================================
             1단계: 회원 정보 입력
             ======================================================== */
          <>
            <SignupIntro aria-labelledby="signup-title">
              <SignupTitle id="signup-title">함께 시작해볼까요?</SignupTitle>
              <SignupDesc>
                말랑말랑한 가계부 생활을 위해
                <br />
                몇 가지 정보가 필요해요.
              </SignupDesc>
            </SignupIntro>

            <SignupFormWrap aria-label="회원가입 입력 폼">
              <SignupForm onSubmit={handleStep1Submit} noValidate>
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
          </>
        ) : (
          /* ========================================================
             2단계: 목표 설정 단계 (신규 반영)
             ======================================================== */
          <GoalSection>
            <SignupIntro aria-labelledby="goal-title">
              <span style={{ fontFamily: 'Jua', fontSize: '16px', color: '#2B4C20', fontWeight: 'bold' }}>목표 설정</span>
              <SignupTitle id="goal-title" style={{ marginTop: '8px' }}>
                한 달 예산을
                <br />
                세워볼까요?
              </SignupTitle>
              <SignupDesc>말랑말랑한 생활을 위해 적당한 목표가 필요해요.</SignupDesc>
            </SignupIntro>

            {/* 한 달 목표 금액 입력 */}
            <div>
              <StanceLabel style={{ color: '#8C8A79' }}>한 달 목표 금액</StanceLabel>
              <GoalInputWrapper>
                <GoalInput
                  type="text"
                  inputMode="numeric"
                  value={budgetVal}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="0"
                  maxLength={12}
                />
                <GoalUnit>원</GoalUnit>
              </GoalInputWrapper>
            </div>

            {/* 이번 달 나의 생활 스탠스는 */}
            <div>
              <StanceLabel>이번 달 나의 생활 스탠스는?</StanceLabel>
              <StanceGrid>
                {stancesList.map((stance) => (
                  <StanceCircleBtn
                    key={stance.name}
                    type="button"
                    $isActive={selectedStance === stance.name}
                    onClick={() => setSelectedStance(stance.name)}
                  >
                    <StanceIconWrap $bgColor={stance.color}>
                      {stance.emoji}
                    </StanceIconWrap>
                    <StanceText>{stance.name}</StanceText>
                  </StanceCircleBtn>
                ))}
              </StanceGrid>
            </div>

            {/* 안내 문구 팁 카드 */}
            <TipCard>
              <TipIcon>💡</TipIcon>
              <TipText>
                나중에 언제든지 수정할 수 있으니 걱정 마세요!
              </TipText>
            </TipCard>

            {/* 완료 버튼 */}
            <BtnComplete type="button" onClick={handleGoalSubmit}>
              <span>목표 완료하기</span>
              <span>→</span>
            </BtnComplete>
          </GoalSection>
        )}
      </SignupMain>
    </SignupContainer>
  );
};

export default SignupPage;
