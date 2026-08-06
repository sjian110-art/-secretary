import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import mongLying from '../assets/mascot/mong_lying.png';

interface Mission {
  id: number;
  label: string;
  reward: number;
  isDone: boolean;
}

const ChallengeMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[6]}`};
  font-family: ${({ theme }) => theme.fonts.serif};

  @media (max-width: 360px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const ChallengeCard = styled.section`
  min-height: 280px;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid #F0DF75;
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: #FFF5A5; /* challenge-yellow */
  box-shadow: ${({ theme }) => theme.shadow.default};
`;

const ChallengeBadge = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  padding: 5px ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #BA5162;
  color: ${({ theme }) => theme.colors.textWhite};
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
`;

const ChallengeTitle = styled.h1`
  color: #171300;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 24px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.5px;
`;

const ChallengeGoal = styled.p`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  font-weight: 700;
`;

const ChallengeAmountText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.5px;

  .unit {
    margin-left: 7px;
    color: ${({ theme }) => theme.colors.textSub};
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: 20px;
    font-weight: 500;
  }
`;

const ProgressTrack = styled.div`
  height: 16px;
  margin-top: ${({ theme }) => theme.spacing[3]};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #E9E2BD;
  box-shadow: ${({ theme }) => theme.shadow.inset};
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};
  transition: width ${({ theme }) => theme.transition.slow};
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[2]}`};

  @media (max-width: 360px) {
    gap: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[1]}`};
  }
`;

const DashCard = styled.article<{ $isLongText?: boolean }>`
  height: 108px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 39px minmax(0, 1fr);
  grid-template-rows: 25px 37px 21px;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[1]} ${theme.spacing[1]}`};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  background: #FFFDF8; /* challenge-paper */
  box-shadow: ${({ theme }) => theme.shadow.default};
  transition:
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
  }

  @media (max-width: 360px) {
    padding-inline: ${({ theme }) => theme.spacing[1]};
  }
`;

const DashTitle = styled.p`
  grid-column: 2;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textSub};
`;

const DashBody = styled.div`
  grid-column: 1 / 3;
  grid-row: 2;
  display: grid;
  grid-template-columns: 39px minmax(0, 1fr);
  align-items: center;
  min-width: 0;
`;

const DashIcon = styled.span<{ $type: string }>`
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;

  svg {
    width: 32px;
    height: 32px;
  }

  ${({ $type }) =>
    $type === 'fire' &&
    css`
      path {
        fill: #FF7076;
      }
    `}

  ${({ $type }) =>
    $type === 'wallet' &&
    css`
      rect:first-child {
        fill: #A7DF91;
      }
      rect:nth-child(2) {
        fill: #88BD78;
      }
      circle {
        fill: ${({ theme }) => theme.colors.surface};
      }
    `}

  ${({ $type }) =>
    $type === 'target' &&
    css`
      circle {
        stroke: #82BFFF;
        stroke-width: 1.8;
      }
      .target-dot {
        fill: #82BFFF;
        stroke: none;
      }
    `}

  ${({ $type }) =>
    $type === 'calendar' &&
    css`
      rect,
      line {
        stroke: #C99CFF;
        stroke-width: 1.8;
        stroke-linecap: round;
      }
    `}
`;

const DashValue = styled.p<{ $customSize?: string }>`
  min-width: 0;
  overflow: hidden;
  color: #344157;
  font-size: ${({ $customSize }) => $customSize || '24px'};
  font-weight: 700;
  letter-spacing: -1px;
  white-space: nowrap;

  .dash-unit {
    margin-left: 1px;
    font-size: 12px;
  }

  @media (max-width: 360px) {
    font-size: 20px;
  }
`;

const DashCaption = styled.p`
  grid-column: 2;
  grid-row: 3;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 12px;
  white-space: nowrap;
`;

/* Mission card */
const MissionCardSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[2]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: #FFFDF8;
  box-shadow: ${({ theme }) => theme.shadow.default};
`;

const MissionHeader = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 6px ${({ theme }) => theme.spacing[2]};
`;

const MissionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const MissionHeaderIcon = styled.span`
  width: 28px;
  height: 28px;
  svg {
    width: 100%;
    height: 100%;
  }
  rect,
  line {
    stroke: ${({ theme }) => theme.colors.primaryDark};
    stroke-width: 1.5;
    stroke-linecap: round;
  }
  rect:nth-child(2) {
    fill: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const MissionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`;

const MissionMascot = styled.img`
  width: 60px;
  height: 40px;
  object-fit: contain;
`;

const MissionList = styled.ul`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  background: #FFFEFA;
  box-shadow: ${({ theme }) => theme.shadow.inset};
`;

const MissionItem = styled.li<{ $isDone: boolean }>`
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-bottom: 1px solid #F4EAD8; /* challenge-line */
  transition: opacity ${({ theme }) => theme.transition.default};

  &:last-child {
    border-bottom: 0;
  }
`;

const MissionCheckBtn = styled.button<{ $isDone: boolean }>`
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  display: grid;
  place-items: center;
  border: 2px solid ${({ theme }) => theme.colors.gray400};
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ theme }) => theme.colors.surface};
  transition:
    border-color ${({ theme }) => theme.transition.default},
    background-color ${({ theme }) => theme.transition.default};

  svg {
    width: 15px;
    height: 15px;
    opacity: ${({ $isDone }) => ($isDone ? 1 : 0)};
    transition: opacity ${({ theme }) => theme.transition.default};
  }

  svg path {
    fill: none;
    stroke: ${({ theme }) => theme.colors.textWhite};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  ${({ $isDone, theme }) =>
    $isDone &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.success};
    `}
`;

const MissionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

const MissionRewardText = styled.span`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 14px;
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

const MissionBonus = styled.p`
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[1]} 5px`};
  border-radius: ${({ theme }) => theme.radius.tag};
  background: ${({ theme }) => theme.colors.successBg};
  font-size: 12px;
  text-align: center;

  strong {
    color: ${({ theme }) => theme.colors.success};
    font-size: 14px;
  }
`;

/* Save button */
const BtnSaveToday = styled.button`
  height: ${({ theme }) => theme.size.btnHeight};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.radius.btn};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 0 ${({ theme }) => theme.colors.primaryDeep};
  color: ${({ theme }) => theme.colors.textWhite};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 20px;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    filter ${({ theme }) => theme.transition.default};

  &:hover:not(:disabled) {
    background-color: #95BC8B;
  }

  &:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: 0 0 0 ${({ theme }) => theme.colors.primaryDeep};
  }

  &:disabled {
    cursor: default;
    opacity: 0.8;
    transform: none;
    box-shadow: none;
  }
`;

const BtnIcon = styled.span`
  width: 28px;
  height: 28px;
  svg {
    width: 100%;
    height: 100%;
  }
  path {
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
  circle {
    fill: currentColor;
  }
`;

export const ChallengePage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const [saveLabel, setSaveLabel] = useState('오늘의 저금');
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, label: '커피 안 사먹기', reward: 3000, isDone: true },
    { id: 2, label: '배달 안 시키기', reward: 10000, isDone: false },
    { id: 3, label: '가계부 작성하기', reward: 1000, isDone: false },
    { id: 4, label: '택시 타지 않기', reward: 8000, isDone: false },
  ]);

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });
  }, [setHeaderConfig]);

  const handleMissionToggle = (id: number) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, isDone: !mission.isDone } : mission
      )
    );
  };

  const handleSaveClick = () => {
    if (isSaveDisabled) return;

    const completedCount = missions.filter((m) => m.isDone).length;
    setSaveLabel(`오늘의 저금 완료 · 미션 ${completedCount}/${missions.length}`);
    setIsSaveDisabled(true);

    setTimeout(() => {
      setSaveLabel('오늘의 저금');
      setIsSaveDisabled(false);
    }, 1800);
  };

  return (
    <ChallengeMain id="challenge-screen">
      <ChallengeCard aria-labelledby="challenge-title">
        <ChallengeBadge>Ongoing Challenge</ChallengeBadge>
        <ChallengeTitle id="challenge-title">비상금 챌린지</ChallengeTitle>
        <ChallengeGoal>Goal: 1,000,000 KRW</ChallengeGoal>
        <ChallengeAmountText>
          450,000<span className="unit">원</span>
        </ChallengeAmountText>
        <ProgressTrack
          role="progressbar"
          aria-label="비상금 챌린지 진행률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={45}
        >
          <ProgressFill $percent={45} />
        </ProgressTrack>
        <ProgressMeta>
          <span>45% 완료</span>
          <span>D-15</span>
        </ProgressMeta>
      </ChallengeCard>

      <section aria-labelledby="dashboard-title">
        <SectionTitle id="dashboard-title">챌린지 대시보드</SectionTitle>
        <DashboardGrid>
          <DashCard>
            <DashTitle>연속 성공</DashTitle>
            <DashBody>
              <DashIcon $type="fire">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C12 6 8 8 8 12.5C8 15.5 10 18 12 18C14.5 18 16 15.8 16 13C17 14 17.5 15.3 17.5 16.5C17.5 19.8 15 22 12 22C8.5 22 5.5 19.3 5.5 15.5C5.5 10.5 9.5 8.5 12 2Z" />
                </svg>
              </DashIcon>
              <DashValue>
                15<span className="dash-unit">일</span>
              </DashValue>
            </DashBody>
            <DashCaption>최고 23일</DashCaption>
          </DashCard>

          <DashCard>
            <DashTitle>오늘 절약</DashTitle>
            <DashBody>
              <DashIcon $type="wallet">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="6" width="18" height="13" rx="3" />
                  <rect x="3" y="6" width="18" height="4" rx="2" />
                  <circle cx="16.5" cy="13" r="1.6" />
                </svg>
              </DashIcon>
              <DashValue>
                8,200<span className="dash-unit">원</span>
              </DashValue>
            </DashBody>
            <DashCaption>어제보다 +1,500원</DashCaption>
          </DashCard>

          <DashCard>
            <DashTitle>목표까지</DashTitle>
            <DashBody>
              <DashIcon $type="target">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle className="target-dot" cx="12" cy="12" r="1.6" />
                </svg>
              </DashIcon>
              <DashValue $customSize="18px">
                550,000<span className="dash-unit">원</span>
              </DashValue>
            </DashBody>
            <DashCaption>남았어요!</DashCaption>
          </DashCard>

          <DashCard>
            <DashTitle>예상 달성일</DashTitle>
            <DashBody>
              <DashIcon $type="calendar">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="4" y="5" width="16" height="16" rx="2" />
                  <line x1="4" y1="10" x2="20" y2="10" />
                  <line x1="8" y1="3" x2="8" y2="7" />
                  <line x1="16" y1="3" x2="16" y2="7" />
                </svg>
              </DashIcon>
              <DashValue $customSize="20px">
                9월 18<span className="dash-unit">일</span>
              </DashValue>
            </DashBody>
            <DashCaption>D-15</DashCaption>
          </DashCard>
        </DashboardGrid>
      </section>

      <MissionCardSection aria-labelledby="mission-title">
        <MissionHeader>
          <MissionHeaderLeft>
            <MissionHeaderIcon>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="6" y="4" width="12" height="17" rx="2" />
                <rect x="9" y="2.5" width="6" height="3" rx="1.2" />
                <line x1="9" y1="10" x2="15" y2="10" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </MissionHeaderIcon>
            <MissionTitle id="mission-title">오늘의 미션</MissionTitle>
          </MissionHeaderLeft>
          <MissionMascot src={mongLying} alt="누워 있는 몽이" />
        </MissionHeader>
        <MissionList>
          {missions.map((mission) => (
            <MissionItem key={mission.id} $isDone={mission.isDone}>
              <MissionCheckBtn
                type="button"
                $isDone={mission.isDone}
                onClick={() => handleMissionToggle(mission.id)}
                aria-pressed={mission.isDone}
                aria-label={`${mission.label} 완료 여부`}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8.5L6.2 11.5L13 4.5" />
                </svg>
              </MissionCheckBtn>
              <MissionLabel>{mission.label}</MissionLabel>
              <MissionRewardText>+{mission.reward.toLocaleString('ko-KR')}원</MissionRewardText>
            </MissionItem>
          ))}
        </MissionList>
        <MissionBonus>
          모든 미션 완료 시 추가 보상 <strong>+2,000원!</strong>
        </MissionBonus>
      </MissionCardSection>

      <BtnSaveToday
        type="button"
        id="btn-save-today"
        disabled={isSaveDisabled}
        onClick={handleSaveClick}
      >
        <BtnIcon className="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 13C4 9.5 7 7 11 7H16C18 7 19.5 8.6 19.5 10.4V10.5C20.4 10.8 21 11.6 21 12.6C21 13.6 20.4 14.4 19.5 14.7V16.5C19.5 17.3 18.9 18 18 18H17V19.5C17 20.3 16.3 21 15.5 21H14.5C13.7 21 13 20.3 13 19.5V18H9V19.5C9 20.3 8.3 21 7.5 21H6.5C5.7 21 5 20.3 5 19.5V16.8C4.4 16 4 15 4 13Z" />
            <circle cx="16" cy="12" r="1" />
          </svg>
        </BtnIcon>
        <span>{saveLabel}</span>
      </BtnSaveToday>
    </ChallengeMain>
  );
};
export default ChallengePage;
