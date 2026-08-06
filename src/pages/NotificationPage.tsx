import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Header } from '../components/Header';

interface NotiItem {
  id: string;
  type: 'budget' | 'record' | 'report';
  title: string;
  time: string;
  summary: string;
  detail: string;
  hasActions?: boolean;
}

const NotiContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.cream};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const NotiMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  flex: 1;
`;

const NotiIntro = styled.section`
  padding: ${({ theme }) => `${theme.spacing[1]} 0 ${theme.spacing[3]}`};
`;

const NotiPageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.4px;
  line-height: 1.2;
  margin-bottom: 6px;
`;

const NotiPageDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
  line-height: 1.5;
`;

const NotiList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`;

const NotiCard = styled.li<{ $type: 'budget' | 'record' | 'report'; $isClosing: boolean }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.cardLg};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadow.default};
  overflow: hidden;
  opacity: 1;
  max-height: 600px;
  transition:
    opacity 0.35s ease,
    max-height 0.4s ease,
    padding 0.35s ease,
    margin 0.35s ease,
    box-shadow ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.default};

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.11);
    transform: translateY(-2px);
  }

  background-color: ${({ $type, theme }) => {
    if ($type === 'budget') return '#FEFAE3'; // light yellow-cream
    if ($type === 'report') return '#F8F3E8'; // greyish cream
    return theme.colors.surface; // record -> white
  }};

  ${({ $isClosing }) =>
    $isClosing &&
    css`
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
      pointer-events: none;
    `}
`;

const NotiCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const NotiIconWrap = styled.div<{ $type: 'budget' | 'record' | 'report' }>`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: ${({ $type }) => {
    if ($type === 'budget') return '#FFE8DF';
    if ($type === 'record') return '#FFF5D6';
    return '#DDE8F8'; // report
  }};

  svg {
    display: block;
  }
`;

const NotiCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const NotiCardTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryDark};
  letter-spacing: -0.2px;
  line-height: 1.3;
`;

const NotiCardTime = styled.time`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.1px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const NotiCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  padding-left: 56px; /* Icon 44px + Gap 12px */
`;

const NotiCardSummary = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.2px;
  line-height: 1.45;
`;

const NotiCardDetail = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSub};
  letter-spacing: -0.2px;
  line-height: 1.7;
`;

const NotiCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding-left: 56px;
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const BtnAction = styled.button<{ $primary: boolean }>`
  height: ${({ theme }) => theme.size.btnHeightSm};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.1px;
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};
  border: none;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  white-space: nowrap;

  &:active {
    transform: translateY(3px);
  }

  ${({ $primary, theme }) =>
    $primary
      ? css`
          background-color: ${theme.colors.primaryDark};
          color: ${theme.colors.textWhite};
          box-shadow: 0 3px 0 ${theme.colors.primaryDeep};

          &:hover {
            background-color: #6DA060;
          }

          &:active {
            box-shadow: none;
          }
        `
      : css`
          background-color: ${theme.colors.creamDark};
          color: ${theme.colors.primaryDark};
          box-shadow: 0 3px 0 ${theme.colors.gray300};

          &:hover {
            background-color: #E8DDA8;
          }

          &:active {
            box-shadow: none;
          }
        `}
`;

export const NotificationPage: React.FC = () => {
  const navigate = useNavigate();

  const [notis, setNotis] = useState<NotiItem[]>([
    {
      id: 'noti-1',
      type: 'budget',
      title: '예산 알림',
      time: '방금 전',
      summary: '예산의 절반을 사용했어요!',
      detail: '이번 달 지출이 계획보다 조금 빨라요.\n비서 몽이와 함께 남은 기간을 잘 설계해볼까요?',
      hasActions: true,
    },
    {
      id: 'noti-2',
      type: 'record',
      title: '오늘의 기록',
      time: '2시간 전',
      summary: '오늘도 기록하러 오셨군요!',
      detail: '작은 기록이 모여 당신의 편안한 내일이 됩니다.\n오늘 쓴 커피값도 잊지 말고 적어주세요.',
    },
    {
      id: 'noti-3',
      type: 'report',
      title: '월간 리포트',
      time: '어제',
      summary: '지난주 소비 리포트가 도착했어요',
      detail: '당신의 한 주를 분석해봤어요.\n가장 많이 지출한 항목은 식비였네요!',
    },
  ]);

  const [closingId, setClosingId] = useState<string | null>(null);

  const handleCloseCard = (id: string) => {
    setClosingId(id);
    setTimeout(() => {
      setNotis((prev) => prev.filter((n) => n.id !== id));
      setClosingId(null);
    }, 400); // Wait for transition animation
  };

  return (
    <NotiContainer id="notification-screen">
      <Header showBackButton={true} />
      <NotiMain>
        <NotiIntro aria-labelledby="noti-page-title">
          <NotiPageTitle id="noti-page-title">알림</NotiPageTitle>
          <NotiPageDesc>비서 몽이가 보낸 소식들이에요.</NotiPageDesc>
        </NotiIntro>

        <NotiList aria-label="알림 목록">
          {notis.map((noti) => (
            <NotiCard
              key={noti.id}
              $type={noti.type}
              $isClosing={closingId === noti.id}
              aria-label={`${noti.title} 카드`}
            >
              <NotiCardTop>
                <NotiIconWrap $type={noti.type} aria-hidden="true">
                  {noti.type === 'budget' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C10.3 2 9 3.3 9 5V5.4C6.6 6.2 5 8.4 5 11V15L3 18H21L19 15V11C19 8.4 17.4 6.2 15 5.4V5C15 3.3 13.7 2 12 2Z"
                        stroke="#C05830"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 18.2C9.5 19.5 10.6 20.5 12 20.5C13.4 20.5 14.5 19.5 14.5 18.2"
                        stroke="#C05830"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {noti.type === 'record' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                        fill="#D4A017"
                        stroke="#D4A017"
                        strokeWidth="0.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z"
                        fill="#D4A017"
                        opacity="0.6"
                        stroke="#D4A017"
                        strokeWidth="0.3"
                      />
                    </svg>
                  )}
                  {noti.type === 'report' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#4A7ABA" strokeWidth="1.8" />
                      <path d="M3 10H21" stroke="#4A7ABA" strokeWidth="1.8" />
                      <path d="M8 3V7" stroke="#4A7ABA" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M16 3V7" stroke="#4A7ABA" strokeWidth="1.8" strokeLinecap="round" />
                      <rect x="7" y="13" width="4" height="4" rx="0.5" fill="#4A7ABA" opacity="0.5" />
                    </svg>
                  )}
                </NotiIconWrap>
                <NotiCardHeader>
                  <NotiCardTitle>{noti.title}</NotiCardTitle>
                  <NotiCardTime dateTime="2026-08-05">{noti.time}</NotiCardTime>
                </NotiCardHeader>
              </NotiCardTop>

              <NotiCardBody>
                <NotiCardSummary>{noti.summary}</NotiCardSummary>
                <NotiCardDetail style={{ whiteSpace: 'pre-line' }}>{noti.detail}</NotiCardDetail>
              </NotiCardBody>

              {noti.hasActions && (
                <NotiCardActions>
                  <BtnAction
                    $primary={true}
                    onClick={() => navigate('/expense/history')}
                    type="button"
                  >
                    내역 확인
                  </BtnAction>
                  <BtnAction
                    $primary={false}
                    onClick={() => handleCloseCard(noti.id)}
                    type="button"
                  >
                    닫기
                  </BtnAction>
                </NotiCardActions>
              )}
            </NotiCard>
          ))}
        </NotiList>
      </NotiMain>
    </NotiContainer>
  );
};
export default NotificationPage;
