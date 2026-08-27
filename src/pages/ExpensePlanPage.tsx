import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const waveMove = keyframes`
  0%, 100% {
    transform: translateX(-2%) rotate(-1deg) scaleY(0.8);
  }
  50% {
    transform: translateX(3%) rotate(1.5deg) scaleY(1.25);
  }
`;

const waveMoveReverse = keyframes`
  0%, 100% {
    transform: translateX(3%) rotate(1deg);
  }
  50% {
    transform: translateX(-3%) rotate(-1deg);
  }
`;

const liquidPulse = keyframes`
  50% {
    filter: saturate(1.08);
    transform: scaleY(1.015);
  }
`;

const bubbleRise = keyframes`
  0% {
    transform: translateY(0) scale(0.45);
    opacity: 0;
  }
  15% {
    opacity: 0.85;
  }
  75% {
    opacity: 0.65;
  }
  100% {
    transform: translateY(-120px) scale(1.05);
    opacity: 0;
  }
`;

const coinFloat = keyframes`
  50% {
    transform: translateY(-7px);
  }
`;

const PlanMain = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[6]}`};
  font-family: ${({ theme }) => theme.fonts.serif};

  @media (max-width: 370px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const BudgetSummary = styled.section`
  position: relative;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BudgetLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
`;

const BudgetAmount = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 48px;
  line-height: 1;
  letter-spacing: -0.5px;

  @media (max-width: 370px) {
    font-size: 40px;
  }
`;

const WonSignText = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 36px;
  font-weight: 500;
`;

const BudgetPeriodBtn = styled.button<{ $expanded: boolean }>`
  width: max-content;
  height: 40px;
  margin: ${({ theme }) => theme.spacing[2]} auto 0;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.creamDark};
  color: #956000;
  font-size: 14px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.body};
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast};

  background: ${({ $expanded }) => ($expanded ? '#E9DDB2' : 'var(--color-cream-dark)')};

  &:hover {
    background: #E9DDB2;
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  svg * {
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }
`;

const DatePickerPanel = styled.div`
  position: absolute;
  z-index: 30;
  top: 100%;
  left: 50%;
  width: min(320px, 90vw);
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};
  text-align: left;
  animation: ${slideUp} ${({ theme }) => theme.transition.default};
`;

const DateInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #6D520D;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
`;

const DateInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  border: 1.5px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.input};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  transition:
    border-color ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(133, 174, 123, 0.2);
    outline: none;
  }
`;

const DateApplyBtn = styled.button`
  grid-column: 1 / -1;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textWhite};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active {
    transform: scale(0.97);
  }
`;

/* Liquid wave container */
const BudgetCircleArea = styled.section`
  position: relative;
  width: min(76vw, 330px);
  height: min(91vw, 395px);
  margin: ${({ theme }) => theme.spacing[4]} auto 0;
`;

const BudgetCircle = styled.div<{ $remainingLevel: number }>`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 6px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.circle};
  background: #FFFDF5;
  box-shadow: ${({ theme }) => theme.shadow.inset};
`;

const LiquidFill = styled.span<{ $remainingLevel: number }>`
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${({ $remainingLevel }) => $remainingLevel}%;
  background: linear-gradient(180deg, #FFEAFB, #FFD8F1);
  transition: height ${({ theme }) => theme.transition.slow};
  animation: ${liquidPulse} 3.2s ease-in-out infinite;
`;

const LiquidWave = styled.span`
  position: absolute;
  left: -15%;
  top: -11px;
  width: 130%;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: #FFEAFB;
`;

const LiquidWaveOne = styled(LiquidWave)`
  animation: ${waveMove} 2.8s ease-in-out infinite;
`;

const LiquidWaveTwo = styled(LiquidWave)`
  top: -7px;
  opacity: 0.52;
  background: #FFF5FC;
  animation: ${waveMoveReverse} 3.6s ease-in-out infinite;
`;

const Coin = styled.span<{ $delay?: string; $top: string; $left?: string; $right?: string }>`
  position: absolute;
  z-index: 2;
  width: 27px;
  height: 27px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;
  background: #FFABE0;
  color: ${({ theme }) => theme.colors.textWhite};
  font-size: 20px;
  font-weight: 700;
  animation: ${coinFloat} 2.5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
`;

const Bubble = styled.span<{ $delay?: string; $size: string; $left?: string; $right?: string }>`
  position: absolute;
  z-index: 3;
  bottom: 8px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: rgba(255, 255, 255, 0.7);
  opacity: 0;
  animation: ${bubbleRise} 2.8s ease-in infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
`;

/* Remaining budget card */
const RemainingCard = styled.section`
  min-height: 120px;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};

  @media (max-width: 370px) {
    padding-inline: ${({ theme }) => theme.spacing[3]};
  }
`;

const RemainingLeft = styled.div``;

const RemainingLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.2px;
`;

const RemainingAmountText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;

  span {
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: 24px;
    font-weight: 500;
  }

  @media (max-width: 370px) {
    font-size: 23px;
  }
`;

const RemainingRight = styled.div`
  width: 120px;
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  text-align: right;
`;

const RemainingRightText = styled.p`
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const UsageTrack = styled.div`
  height: 8px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.gray300};
`;

const UsageFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};
  transition: width ${({ theme }) => theme.transition.slow};
`;

const AttitudeArea = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const AttitudeLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.hand};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 17px;
  font-weight: 500;
`;

const AttitudeBadge = styled.div<{ $stance: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  color: #7A3B4D;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(239, 221, 235, 0.4);

  ${({ $stance }) => {
    switch ($stance) {
      case '허리띠 졸라매기':
        return 'background-color: #FFEAEF; border: 1px solid #EFDDEB; color: #7A3B4D;';
      case '바지 꽉 잠궈입기':
        return 'background-color: #FFF0E4; border: 1px solid #EFDFDD; color: #7A4B3E;';
      case '평소처럼 유지':
        return 'background-color: #EBF4FF; border: 1px solid #DDE9EF; color: #2A5A9F;';
      case '트레이닝 팬츠 입기':
        return 'background-color: #EAF5EA; border: 1px solid #DDEFD5; color: #27823A;';
      case '여유롭게 즐기기':
        return 'background-color: #F3E8FF; border: 1px solid #ECDDFE; color: #6A2ABF;';
      default:
        return 'background-color: #FFF0FA; border: 1px solid #EFDDEB; color: #7A3B4D;';
    }
  }}
`;

const PiggyIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: inherit;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

/* Encourage Card */
const EncourageCard = styled.section`
  min-height: 150px;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: ${({ theme }) => theme.colors.yellowLight};
  box-shadow: ${({ theme }) => theme.shadow.default};
  border: 1.5px solid ${({ theme }) => theme.colors.gray300};

  @media (max-width: 370px) {
    padding-inline: ${({ theme }) => theme.spacing[3]};
  }
`;

const EncourageIcon = styled.span`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primaryDark};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  svg {
    width: ${({ theme }) => theme.icon.md};
    height: ${({ theme }) => theme.icon.md};
  }

  path {
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linejoin: round;
  }
`;

const EncourageText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 19px;
  line-height: 1.5;
  letter-spacing: -0.3px;

  @media (max-width: 370px) {
    font-size: 18px;
  }
`;

const EncourageSign = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 16px;
  text-align: right;
`;

/* Buttons Grid */
const ActionButtons = styled.section`
  margin: ${({ theme }) => theme.spacing[4]} 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionBtn = styled.button<{ $primary: boolean }>`
  height: 90px;
  border-radius: ${({ theme }) => theme.radius.cardSm};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  ${({ $primary, theme }) =>
    $primary
      ? css`
          background: ${theme.colors.primary};
          box-shadow: 0 4px 0 ${theme.colors.primaryDeep};
          color: ${theme.colors.textWhite};

          &:hover {
            background-color: #95BC8B;
          }

          &:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 ${theme.colors.primaryDeep};
          }
        `
      : css`
          background: ${theme.colors.surface};
          border: 1.5px solid ${theme.colors.gray300};
          box-shadow: 0 4px 0 ${theme.colors.gray300};
          color: ${theme.colors.text};

          &:hover {
            background: ${theme.colors.gray100};
          }

          &:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 ${theme.colors.gray300};
          }
        `}
`;

const ActionIcon = styled.span`
  height: 32px;
  display: grid;
  place-items: center;
`;

const PlusIcon = styled.span`
  width: 28px;
  height: 28px;
  border: 2px solid ${({ theme }) => theme.colors.textWhite};
  border-radius: ${({ theme }) => theme.radius.circle};

  svg {
    width: 16px;
    height: 16px;
  }

  line {
    stroke: currentColor;
    stroke-width: 2.6;
    stroke-linecap: round;
  }
`;



/* Edit monthly budget button */
const BtnEditBudget = styled.button`
  width: 100%;
  height: ${({ theme }) => theme.size.btnHeight};
  margin: ${({ theme }) => theme.spacing[3]} 0 0 0;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.btn};
  background: #FFF0FA;
  box-shadow: 0 4px 0 #A64B5C;
  color: #5B0D26;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: #FFE4F7;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #A64B5C;
  }
`;

const GearIcon = styled.span`
  font-size: 24px;
  display: flex;
  align-items: center;
`;

const EditArrow = styled.span`
  margin-left: auto;
  font-size: 24px;
  display: flex;
  align-items: center;
`;

export const ExpensePlanPage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  // States
  const [budget, setBudget] = useState(1200000);
  const [spentAmount, setSpentAmount] = useState(780000);
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [startDateInput, setStartDateInput] = useState('2026-08-01');
  const [endDateInput, setEndDateInput] = useState('2026-08-31');
  const [attitude, setAttitude] = useState('허리띠 졸라매기');

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
    });

    // Load budget & attitude from localStorage if present
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
      setBudget(Number(savedBudget));
    }
    const savedAttitude = localStorage.getItem('attitude');
    if (savedAttitude) {
      setAttitude(savedAttitude);
    }

    // Compute spentAmount dynamically from stored expenses
    const stored = localStorage.getItem('expenses');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const sum = parsed.reduce((acc: number, curr: any) => acc + curr.amount, 0);
        setSpentAmount(sum || 780000);
      } catch {
        setSpentAmount(780000);
      }
    } else {
      setSpentAmount(780000);
    }
  }, [setHeaderConfig]);

  const getAttitudeIcon = (stance: string) => {
    switch (stance) {
      case '허리띠 졸라매기':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 10.5c0-.83-.67-1.5-1.5-1.5H18c0-1.8-1.04-3.36-2.55-4.14l.85-1.7a.5.5 0 00-.89-.45l-1 2A7.94 7.94 0 0012 5c-.75 0-1.47.1-2.16.3l-1-2a.5.5 0 00-.89.45l.85 1.7C7.29 6.22 6.25 7.78 6.25 9.5H6C5.17 9.5 4.5 10.17 4.5 11c0 .76.57 1.39 1.31 1.48C5.23 13.56 5 14.76 5 16v1c0 .83.67 1.5 1.5 1.5h1.25c.57 1.22 1.8 2.08 3.25 2.08s2.68-.86 3.25-2.08h1.25c.83 0 1.5-.67 1.5-1.5v-1c0-1.24-.23-2.44-.81-3.52.74-.09 1.31-.72 1.31-1.48zM12 7c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
          </svg>
        );
      case '바지 꽉 잠궈입기':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        );
      case '평소처럼 유지':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        );
      case '트레이닝 팬츠 입기':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2v6h12V2H6zm0 8h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2z" />
          </svg>
        );
      case '여유롭게 즐기기':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 9h-4V7h-2v4H7v2h4v4h2v-4h4v-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Click outside close panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyDates = () => {
    if (!startDateInput || !endDateInput) {
      window.alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }
    const start = new Date(`${startDateInput}T00:00:00`);
    const end = new Date(`${endDateInput}T00:00:00`);

    if (start > end) {
      window.alert('종료일은 시작일보다 빠를 수 없어요.');
      return;
    }

    setStartDate(startDateInput);
    setEndDate(endDateInput);
    setIsPanelOpen(false);
  };



  const getFormattedPeriod = () => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    return `${start.getMonth() + 1}월 ${start.getDate()}일 - ${end.getMonth() + 1}월 ${end.getDate()}일`;
  };

  // Calculations
  const remaining = Math.max(budget - spentAmount, 0);
  const usedPercent = Math.min(Math.round((spentAmount / budget) * 100), 100);
  const remainingPercent = Math.max(100 - usedPercent, 0);

  return (
    <PlanMain id="plan-screen">
      <BudgetSummary>
        <BudgetLabel id="budget-label">이번 달 예산</BudgetLabel>
        <BudgetAmount>
          <WonSignText className="won-sign">₩</WonSignText>
          <span id="budget-amount">{budget.toLocaleString('ko-KR')}</span>
        </BudgetAmount>
        <BudgetPeriodBtn
          $expanded={isPanelOpen}
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          aria-haspopup="dialog"
          aria-expanded={isPanelOpen}
          aria-controls="date-picker-panel"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="16" y1="3" x2="16" y2="7" />
          </svg>
          <span id="budget-period-text">{getFormattedPeriod()}</span>
        </BudgetPeriodBtn>

        {isPanelOpen && (
          <DatePickerPanel id="date-picker-panel" role="dialog" aria-label="예산 기간 선택" ref={panelRef}>
            <DateInputLabel>
              <span>시작일</span>
              <DateInput
                type="date"
                id="budget-start-date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
              />
            </DateInputLabel>
            <DateInputLabel>
              <span>종료일</span>
              <DateInput
                type="date"
                id="budget-end-date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
              />
            </DateInputLabel>
            <DateApplyBtn id="date-apply-btn" onClick={handleApplyDates} type="button">
              날짜 적용
            </DateApplyBtn>
          </DatePickerPanel>
        )}
      </BudgetSummary>

      <BudgetCircleArea aria-label={`예산 잔여량 ${remainingPercent}퍼센트`}>
        <Coin $delay="0s" $top="15px" $left="58%">$</Coin>
        <Coin $delay="-0.8s" $top="42px" $left="14%">$</Coin>
        <Coin $delay="-1.5s" $top="56px" $right="14%">$</Coin>

        <BudgetCircle $remainingLevel={remainingPercent} id="budget-circle">
          <LiquidFill $remainingLevel={remainingPercent} className="liquid-fill" aria-hidden="true">
            <LiquidWaveOne className="liquid-wave liquid-wave-1" />
            <LiquidWaveTwo className="liquid-wave liquid-wave-2" />
          </LiquidFill>
          <Bubble $delay="0s" $size="16px" $left="20%" className="bubble bubble-1" />
          <Bubble $delay="0.5s" $size="12px" $left="46%" className="bubble bubble-2" />
          <Bubble $delay="1.1s" $size="9px" $left="33%" className="bubble bubble-3" />
          <Bubble $delay="1.6s" $size="17px" $right="25%" className="bubble bubble-4" />
          <Bubble $delay="2.1s" $size="8px" $right="39%" className="bubble bubble-5" />
          <Bubble $delay="2.5s" $size="11px" $left="58%" className="bubble bubble-6" />
        </BudgetCircle>
      </BudgetCircleArea>

      <AttitudeArea>
        <AttitudeLabel>이번 달 나의 태도</AttitudeLabel>
        <AttitudeBadge $stance={attitude}>
          <PiggyIcon>
            {getAttitudeIcon(attitude)}
          </PiggyIcon>
          <span>{attitude}</span>
        </AttitudeBadge>
      </AttitudeArea>

      <RemainingCard aria-label="남은 예산">
        <RemainingLeft>
          <RemainingLabel>남은 예산</RemainingLabel>
          <RemainingAmountText>
            <span>₩</span>
            <strong id="remaining-amount">{remaining.toLocaleString('ko-KR')}</strong>
          </RemainingAmountText>
        </RemainingLeft>
        <RemainingRight>
          <RemainingRightText>
            <strong id="usage-percent">{usedPercent}%</strong> 사용
          </RemainingRightText>
          <UsageTrack>
            <UsageFill $percent={usedPercent} id="usage-fill" />
          </UsageTrack>
        </RemainingRight>
      </RemainingCard>

      <EncourageCard>
        <EncourageIcon className="encourage-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5H20V16H9L4 20V5Z" />
          </svg>
        </EncourageIcon>
        <div>
          <EncourageText className="encourage-text">
            “잘하고 있어요!
            <br />
            지난달보다 5만 원을 더 아꼈어요.
            <br />
            지금처럼만 계속해봐요” 😊
          </EncourageText>
          <EncourageSign className="encourage-sign">- 비서 몽이</EncourageSign>
        </div>
      </EncourageCard>

      <ActionButtons aria-label="예산 관련 메뉴">
        <ActionBtn
          $primary={true}
          onClick={() => navigate('/expense/write')}
          type="button"
        >
          <ActionIcon className="action-icon">
            <PlusIcon className="plus-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </PlusIcon>
          </ActionIcon>
          <span>지출 추가</span>
        </ActionBtn>

        <ActionBtn
          $primary={false}
          onClick={() => navigate('/daily-log')}
          type="button"
        >
          <ActionIcon className="action-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#956000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </ActionIcon>
          <span>데일리 로그</span>
        </ActionBtn>
      </ActionButtons>

      <BtnEditBudget onClick={() => navigate('/expense/plan/edit')} type="button">
        <GearIcon className="gear-icon">⚙</GearIcon>
        <span>월 예산 수정</span>
        <EditArrow className="edit-arrow">›</EditArrow>
      </BtnEditBudget>
    </PlanMain>
  );
};
export default ExpensePlanPage;
