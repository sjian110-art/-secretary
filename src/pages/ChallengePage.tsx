import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { BottomNavigation } from '../components/BottomNavigation';
import mongCurious from '../assets/mascot/mong_curious.png';

const ChallengeContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.cream};
  display: flex;
  flex-direction: column;
`;

const ChallengeMain = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[4]}`};
  font-family: ${({ theme }) => theme.fonts.serif};

  @media (max-width: 360px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const OngoingBadge = styled.div`
  background-color: #EE4A5E; /* 시안 붉은색 Ongoing Challenge 배지 */
  border-radius: 14px;
  color: #FFFFFF;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 800;
  padding: 6px 20px;
  margin: 0 auto 16px;
  width: fit-content;
  text-align: center;
  box-shadow: 0 2px 6px rgba(238, 74, 94, 0.3);
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const FireIcon = styled.span`
  font-size: 24px;
`;

const ChallengeTitle = styled.h1`
  color: #21160F;
  font-family: 'Jua', sans-serif;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  text-align: center;
`;

const ChallengeGoal = styled.p`
  margin-top: 6px;
  text-align: center;
  color: #5C524B;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
`;

/* 메인 진행률 카드 */
const MainProgressCard = styled.section`
  background-color: #FFFDF5;
  border-radius: 28px;
  border: 1.5px solid #ECE7D4;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(236, 231, 212, 0.3);
  margin-bottom: 24px;
  position: relative;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CardProgressLabel = styled.span`
  color: #8C8A79;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
`;

const CardDDay = styled.span`
  color: #8C8A79;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
`;

const SavingsAmountText = styled.p`
  color: #EE4A5E; /* 붉은색 저금액 */
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 38px;
  font-weight: 800;
  margin: 8px 0;

  span {
    color: #21160F;
    font-family: 'Jua', sans-serif;
    font-size: 28px;
    font-weight: bold;
    margin-left: 4px;
  }
`;

const ProgressTrack = styled.div`
  height: 16px;
  background-color: #FFE6EA; /* 연핑크 트랙 */
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: 8px;
  background-color: #EE4A5E; /* 붉은색 게이지 */
  transition: width 0.5s ease-out;
`;

/* 상세 대시보드 리스트 */
const DashboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const DashItemRow = styled.div`
  background-color: #FFFDF5;
  border: 1.5px solid #ECE7D4;
  border-radius: 24px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 16px;
  font-weight: 700;
  color: #5C524B;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);

  strong {
    color: #21160F;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 18px;
    font-weight: 800;
    padding: 0 2px;
  }

  .caption {
    font-size: 13px;
    color: #8C8A79;
    padding-left: 4px;
  }
`;

/* 하단 큰 액션 버튼 2개 */
const ActionBtnModify = styled.button`
  background-color: #FFF0FA;
  border: 1px solid #EFDDEB;
  box-shadow: 0 4px 0 #A64B5C;
  color: #5B0D26;
  height: 52px;
  border-radius: 26px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 700;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #A64B5C;
  }

  .icon {
    font-size: 16px;
    margin-right: 6px;
  }

  .arrow {
    position: absolute;
    right: 24px;
    font-size: 18px;
    font-weight: bold;
  }
`;

const ActionBtnSave = styled.button`
  background-color: #7DA678; /* 연두색 저금 버튼 */
  border: 1px solid #749A6F;
  box-shadow: 0 4px 0 #577753;
  color: #FFFFFF;
  height: 52px;
  border-radius: 26px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 700;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #577753;
  }

  .icon {
    font-size: 18px;
  }
`;

/* 팝업 Overlay */
const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupCard = styled.div`
  background-color: #FFFDF5;
  border-radius: 36px;
  border: 1.5px solid #ECE7D4;
  width: 90%;
  max-width: 360px;
  padding: 24px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PopupCloseBtn = styled.button`
  position: absolute;
  right: 24px;
  top: 24px;
  background: none;
  border: 0;
  font-size: 20px;
  color: #8C8A79;
  cursor: pointer;
  font-weight: bold;
`;

const PopupTitle = styled.h2`
  text-align: center;
  margin: 0 0 16px 0;
  color: #2B4C20;
  font-family: 'Jua', sans-serif;
  font-size: 20px;
  font-weight: bold;
`;

const PopupCharacter = styled.div`
  width: 90px;
  height: 90px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const PopupForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PopupLabel = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  color: #2B4C20;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
`;

/* 챌린지 이름 수정 인풋 */
const NameInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const NameInput = styled.input`
  background: #FFFDF5;
  border: 1px solid #ECE7D4;
  border-radius: 20px;
  height: 40px;
  padding: 0 36px 0 16px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
  color: #21160F;
  width: 100%;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #C2E2C0;
  }
`;

const PenIconDeco = styled.span`
  position: absolute;
  right: 14px;
  font-size: 14px;
  color: #8C8A79;
  pointer-events: none;
`;

/* 목표 금액 입력란 */
const GoalInputWrapper = styled.div`
  background-color: #FFFCEE;
  border-radius: 24px;
  height: 64px;
  border: 1px solid #FFF5D0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.01);
`;

const GoalInput = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 24px;
  font-weight: 800;
  color: #21160F;
  width: 180px;
  text-align: right;
`;

const GoalUnit = styled.span`
  font-family: 'Jua', sans-serif;
  font-size: 20px;
  color: #21160F;
  font-weight: bold;
`;

/* 날짜 기간 선택 */
const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateBox = styled.div`
  background: #FFFDF5;
  border: 1px solid #ECE7D4;
  border-radius: 20px;
  height: 44px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const DateLabel = styled.span`
  font-size: 10px;
  color: #8C8A79;
  font-weight: bold;
`;

const StyledDateInput = styled.input`
  border: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
  color: #21160F;
  text-align: center;
  width: 100%;
  height: 24px;
  outline: none;
  cursor: pointer;
`;

const ArrowIcon = styled.span`
  color: #8C8A79;
  font-weight: bold;
`;

const DurationBadge = styled.div`
  background-color: #EAF5EA; /* 연녹색 도전 일수 배지 */
  border-radius: 12px;
  color: #27823A;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 800;
  padding: 4px 14px;
  width: fit-content;
  margin: 8px auto 0;
  text-align: center;
`;

/* 나에게 주는 보상 */
const RewardInput = styled.input`
  background: #FFFDF5;
  border: 1px solid #ECE7D4;
  border-radius: 20px;
  height: 44px;
  padding: 0 16px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: #21160F;
  width: 100%;

  &::placeholder {
    color: #C4C0B4;
  }

  &:focus {
    outline: none;
    border-color: #C2E2C0;
  }
`;

/* 팝업 안내 박스 */
const PopupTipCard = styled.div`
  background-color: #FFF9E3;
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
`;

const TipInfoIcon = styled.span`
  color: #FFC000;
  font-size: 16px;
  flex-shrink: 0;
`;

const TipInfoText = styled.p`
  color: #7D5B18;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  margin: 0;
`;

/* 공유 버튼 및 수정 버튼 */
const PopupBtnShare = styled.button`
  background-color: #FCE897; /* 노란색 공유 버튼 */
  border: 1px solid #E2D086;
  color: #5C4C18;
  height: 48px;
  border-radius: 24px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 700;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #EDDA8A;
  }
`;

const PopupBtnSave = styled.button`
  background-color: #7DA678; /* 수정 완료하기 버튼 */
  color: #FFFFFF;
  height: 48px;
  border-radius: 24px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #749A6F;
  }
`;

export const ChallengePage: React.FC = () => {
  const { setHeaderConfig } = useHeader();

  // 팝업 열림/닫힘 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 챌린지 주요 데이터 상태
  const [challengeName, setChallengeName] = useState('비상금 챌린지');
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [currentSavings, setCurrentSavings] = useState(450000);
  
  // 날짜 설정 (D-15 및 45일간의 도전 연출)
  // 오늘 날짜 2026-08-07 기준
  const [startDate, setStartDate] = useState('2026-07-09');
  const [endDate, setEndDate] = useState('2026-08-22');
  const [rewardText, setRewardText] = useState('제주도 여행');

  // 팝업 내부용 임시 입력 상태
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editReward, setEditReward] = useState('');

  // 컴포넌트 마운트 시 로드
  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
    });

    const savedName = localStorage.getItem('challenge_name');
    if (savedName) setChallengeName(savedName);

    const savedGoal = localStorage.getItem('challenge_goal');
    if (savedGoal) setGoalAmount(Number(savedGoal));

    const savedSavings = localStorage.getItem('challenge_savings');
    if (savedSavings) setCurrentSavings(Number(savedSavings));

    const savedStart = localStorage.getItem('challenge_start');
    if (savedStart) setStartDate(savedStart);

    const savedEnd = localStorage.getItem('challenge_end');
    if (savedEnd) setEndDate(savedEnd);

    const savedReward = localStorage.getItem('challenge_reward');
    if (savedReward) setRewardText(savedReward);
  }, [setHeaderConfig]);

  // 팝업 오픈 상태를 전역 헤더 컨텍스트에 동기화
  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      isModalOpen: isPopupOpen,
    });
  }, [isPopupOpen, setHeaderConfig]);

  // 계산 영역
  const remainingAmount = Math.max(goalAmount - currentSavings, 0);
  const progressPercent = Math.min(Math.round((currentSavings / goalAmount) * 100), 100);

  // 도전 일수 계산
  const getChallengeDuration = (start: string, end: string) => {
    try {
      const sDate = new Date(start);
      const eDate = new Date(end);
      const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return isNaN(diffDays) ? 0 : diffDays;
    } catch {
      return 0;
    }
  };



  // D-Day 계산
  const getDDay = (targetDate: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(targetDate);
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(diffDays)) return 'D-';
      return diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? 'D-Day' : `D+${Math.abs(diffDays)}`;
    } catch {
      return 'D-';
    }
  };

  const dDayText = getDDay(endDate);

  // 예상 달성일 포맷팅
  const getFormattedDate = (targetDate: string) => {
    try {
      const dateObj = new Date(targetDate);
      const m = dateObj.getMonth() + 1;
      const d = dateObj.getDate();
      return isNaN(m) ? '' : `${m}월 ${d}일`;
    } catch {
      return '';
    }
  };

  const targetDateFormatted = getFormattedDate(endDate);

  // 팝업 열기 핸들러
  const handleOpenPopup = () => {
    setEditName(challengeName);
    setEditGoal(goalAmount.toLocaleString('ko-KR'));
    setEditStart(startDate);
    setEditEnd(endDate);
    setEditReward(rewardText);
    setIsPopupOpen(true);
  };

  // 팝업 금액 필터
  const handleAmountInput = (val: string) => {
    const rawValue = val.replace(/[^\d]/g, '');
    setEditGoal(rawValue ? Number(rawValue).toLocaleString('ko-KR') : '');
  };

  // 팝업 저장 핸들러
  const handleSave = () => {
    const cleanGoal = Number(editGoal.replace(/[^\d]/g, ''));
    if (!cleanGoal || cleanGoal === 0) {
      window.alert('올바른 목표 금액을 입력해주세요.');
      return;
    }

    if (!editStart || !editEnd) {
      window.alert('시작일과 종료일을 입력해주세요.');
      return;
    }

    const sDate = new Date(editStart);
    const eDate = new Date(editEnd);
    if (sDate > eDate) {
      window.alert('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    // 상태 저장
    setChallengeName(editName);
    setGoalAmount(cleanGoal);
    setStartDate(editStart);
    setEndDate(editEnd);
    setRewardText(editReward);

    // 로컬스토리지 저장
    localStorage.setItem('challenge_name', editName);
    localStorage.setItem('challenge_goal', String(cleanGoal));
    localStorage.setItem('challenge_start', editStart);
    localStorage.setItem('challenge_end', editEnd);
    localStorage.setItem('challenge_reward', editReward);

    setIsPopupOpen(false);
  };

  // 오늘의 저금 핸들러 (실제 저금 연동)
  const handleDepositToday = () => {
    const input = window.prompt('오늘 얼마를 저금할까요?', '10,000');
    if (input === null) return;

    const parsed = Number(input.replace(/[^\d]/g, ''));
    if (isNaN(parsed) || parsed <= 0) {
      window.alert('올바른 저금 금액을 입력해주세요.');
      return;
    }

    const newSavings = currentSavings + parsed;
    setCurrentSavings(newSavings);
    localStorage.setItem('challenge_savings', String(newSavings));
    window.alert(`오늘의 저금 완료! ₩${parsed.toLocaleString()}원이 모금되었습니다.`);
  };

  return (
    <ChallengeContainer id="challenge-screen">
      <ChallengeMain>
        <OngoingBadge>Ongoing Challenge</OngoingBadge>
        <TitleWrapper>
          <FireIcon>🔥</FireIcon>
          <ChallengeTitle>{challengeName}</ChallengeTitle>
          <FireIcon>🔥</FireIcon>
        </TitleWrapper>
        <ChallengeGoal>목표 : {goalAmount.toLocaleString('ko-KR')} 원</ChallengeGoal>

        {/* 메인 진행률 카드 */}
        <MainProgressCard>
          <CardHeader>
            <CardProgressLabel>{progressPercent}% 완료</CardProgressLabel>
            <CardDDay>{dDayText}</CardDDay>
          </CardHeader>
          <SavingsAmountText>
            {currentSavings.toLocaleString('ko-KR')}
            <span>원</span>
          </SavingsAmountText>
          <ProgressTrack>
            <ProgressFill $percent={progressPercent} />
          </ProgressTrack>
        </MainProgressCard>

        {/* 상세 대시보드 리스트 */}
        <DashboardList>
          {/* 남은 금액 */}
          <DashItemRow>
            목표까지 <strong>{remainingAmount.toLocaleString('ko-KR')}원</strong> 남았어요!
          </DashItemRow>

          {/* 연속 성공 */}
          <DashItemRow>
            연속 성공 <strong>15일</strong>
            <span className="caption">최고 23일</span>
          </DashItemRow>

          {/* 예상 달성일 */}
          <DashItemRow>
            예상 달성일 <strong>{targetDateFormatted}</strong>
            <span className="caption">{dDayText}</span>
          </DashItemRow>
        </DashboardList>

        {/* 하단 액션 버튼 2개 */}
        <ActionBtnModify type="button" onClick={handleOpenPopup}>
          <span className="icon">✏️</span>
          <span>챌린지 수정</span>
          <span className="arrow">›</span>
        </ActionBtnModify>

        <ActionBtnSave type="button" onClick={handleDepositToday}>
          <span className="icon">🐷</span>
          <span>오늘의 저금</span>
        </ActionBtnSave>
      </ChallengeMain>

      <BottomNavigation />

      {/* 챌린지 수정 팝업 */}
      {isPopupOpen && (
        <PopupOverlay onClick={() => setIsPopupOpen(false)}>
          <PopupCard id="challenge-edit-popup" onClick={(e) => e.stopPropagation()}>
            <PopupCloseBtn onClick={() => setIsPopupOpen(false)}>×</PopupCloseBtn>
            <PopupTitle>비상금 챌린지 수정</PopupTitle>
            <PopupCharacter>
              <img src={mongCurious} alt="생각하는 몽이" />
            </PopupCharacter>

            <PopupForm>
              {/* 챌린지 이름 수정 */}
              <div>
                <PopupLabel>챌린지 이름 수정</PopupLabel>
                <NameInputWrapper>
                  <NameInput
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="챌린지 이름 입력"
                  />
                  <PenIconDeco>✏️</PenIconDeco>
                </NameInputWrapper>
              </div>

              {/* 목표 금액 */}
              <div>
                <PopupLabel>목표 금액</PopupLabel>
                <GoalInputWrapper>
                  <GoalInput
                    type="text"
                    inputMode="numeric"
                    value={editGoal}
                    onChange={(e) => handleAmountInput(e.target.value)}
                    placeholder="0"
                  />
                  <GoalUnit>원</GoalUnit>
                </GoalInputWrapper>
              </div>

              {/* 챌린지 기간 */}
              <div>
                <PopupLabel>챌린지 기간</PopupLabel>
                <PeriodRow>
                  <DateBox>
                    <DateLabel>시작일</DateLabel>
                    <StyledDateInput
                      type="date"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                    />
                  </DateBox>
                  <ArrowIcon>→</ArrowIcon>
                  <DateBox>
                    <DateLabel>종료일</DateLabel>
                    <StyledDateInput
                      type="date"
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                    />
                  </DateBox>
                </PeriodRow>
                <DurationBadge>
                  총 {getChallengeDuration(editStart, editEnd)}일간의 도전
                </DurationBadge>
              </div>

              {/* 나에게 주는 보상 */}
              <div>
                <PopupLabel>나에게 주는 보상</PopupLabel>
                <RewardInput
                  type="text"
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  placeholder="예: 제주도 여행, 근사한 저녁 식사"
                />
              </div>

              {/* 팝업 경고 메시지 팁 */}
              <PopupTipCard>
                <TipInfoIcon>ⓘ</TipInfoIcon>
                <TipInfoText>
                  목표를 수정해도 지금까지 모은 금액은 사라지지 않아요!
                </TipInfoText>
              </PopupTipCard>

              {/* 공유하기 버튼 */}
              <PopupBtnShare type="button" onClick={() => window.alert('친구 공유 기능은 준비 중입니다.')}>
                <span>🔗 친구에게 챌린지 공유하기</span>
              </PopupBtnShare>

              {/* 완료 버튼 */}
              <PopupBtnSave type="button" onClick={handleSave}>
                수정 완료하기
              </PopupBtnSave>
            </PopupForm>
          </PopupCard>
        </PopupOverlay>
      )}
    </ChallengeContainer>
  );
};

export default ChallengePage;
