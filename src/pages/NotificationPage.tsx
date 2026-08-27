import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface NotiItem {
  id: string;
  type: 'budget' | 'record' | 'report';
  title: string;
  time: string;
  summary: string;
  detail: string;
  actionText: string;
  actionRoute: string;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  closeBtnBg: string;
  closeBtnTextColor: string;
}

const NotiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65); /* 어두운 Dim 처리 공통 적용 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; /* 최상위 z-index 지정 */
  padding: 20px;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const NotiModalContent = styled.div`
  width: 100%;
  max-width: 360px;
  background-color: #FFFDF4; /* 다른 모달들과 일치하는 크림색 */
  border-radius: 40px;
  padding: 32px 24px 24px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: 85vh;
  box-shadow: 0 16px 40px rgba(33, 22, 15, 0.12);
`;

const NotiMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto; /* 카드 목록이 팝업 범위를 넘길 때 내부 스크롤 보장 */
  padding-right: 4px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #E2DCCE;
    border-radius: 4px;
  }
`;

/* 우측 상단 X 닫기 버튼 */
const ClosePageButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  z-index: 10;

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const NotiIntro = styled.section`
  padding: 8px 0 24px;
`;

const NotiPageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 26px;
  font-weight: bold;
  color: #21160F;
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

const NotiPageDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  color: #7A7A7A;
  margin: 0;
  line-height: 1.4;
`;

const NotiList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const NotiCard = styled.li<{ $cardBg: string; $isClosing: boolean }>`
  width: 100%;
  border-radius: 32px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${({ $cardBg }) => $cardBg};
  box-shadow: 0 8px 24px rgba(33, 22, 15, 0.03);
  overflow: hidden;
  opacity: 1;
  max-height: 600px;
  transition:
    opacity 0.35s ease,
    max-height 0.4s ease,
    padding 0.35s ease,
    margin 0.35s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 12px 32px rgba(33, 22, 15, 0.06);
    transform: translateY(-2px);
  }

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
  gap: 12px;
  margin-bottom: 16px;
`;

const NotiIconWrap = styled.div<{ $iconBg: string }>`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${({ $iconBg }) => $iconBg};

  svg {
    display: block;
  }
`;

const NotiCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 8px;
`;

const NotiCardTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: bold;
  color: #C05830; /* 기본 연한 고동/적갈색 계열 */
  margin: 0;
`;

const NotiCardTime = styled.time`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: #A4A4A4;
  white-space: nowrap;
  flex-shrink: 0;
`;

const NotiCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 58px; /* Icon 46px + Gap 12px */
`;

const NotiCardSummary = styled.p`
  font-family: 'Jua', sans-serif;
  font-size: 17px;
  font-weight: 500;
  color: #21160F;
  margin: 0;
  line-height: 1.3;
`;

const NotiCardDetail = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: #555555;
  margin: 0;
  line-height: 1.6;
`;

const NotiCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 58px;
  margin-top: 20px;
`;

const BtnAction = styled.button<{ $isPrimary: boolean; $closeBg?: string; $closeTextColor?: string }>`
  height: 38px;
  border-radius: 9999px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s ease;
  border: none;
  padding: 0 20px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.96);
  }

  ${({ $isPrimary, $closeBg, $closeTextColor }) =>
    $isPrimary
      ? css`
          background-color: #1B4C15; /* 짙은 포레스트 초록 */
          color: #FFFFFF;

          &:hover {
            background-color: #12330E;
          }
        `
      : css`
          background-color: ${$closeBg || '#EFEAE2'};
          color: ${$closeTextColor || '#4E3F30'};

          &:hover {
            filter: brightness(0.96);
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
      actionText: '내역 확인',
      actionRoute: '/expense/history',
      cardBg: '#FFFCD4', // 연노랑
      iconBg: '#FFE6E7', // 연분홍
      iconColor: '#C05830',
      closeBtnBg: '#F9F0CE', // 카드 톤에 매칭되는 닫기 버튼 배경
      closeBtnTextColor: '#4E3F30',
    },
    {
      id: 'noti-2',
      type: 'record',
      title: '오늘의 기록',
      time: '2시간 전',
      summary: '오늘도 기록하러 오셨군요!',
      detail: '작은 기록이 모여 당신의 편안한 내일이 됩니다.\n오늘 쓴 커피값도 잊지 말고 적어주세요.',
      actionText: '기록하러 가기',
      actionRoute: '/expense/write',
      cardBg: '#FFFFFF', // 흰색
      iconBg: '#FDEFD9', // 연한 살구색
      iconColor: '#D4A017',
      closeBtnBg: '#FFF2F2', // 연한 핑크 화이트
      closeBtnTextColor: '#5A4E4E',
    },
    {
      id: 'noti-3',
      type: 'report',
      title: '월간 리포트',
      time: '어제',
      summary: '지난주 소비 리포트가 도착했어요',
      detail: '당신의 한 주를 분석해봤어요.\n가장 많이 지출한 항목은 식비였네요!',
      actionText: '리포트 보기',
      actionRoute: '/statistics',
      cardBg: '#F9F4EE', // 연베이지
      iconBg: '#DCE7F4', // 연하늘
      iconColor: '#4A7ABA',
      closeBtnBg: '#EFEAE2', // 연베이지 닫기
      closeBtnTextColor: '#4E3D30',
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
    <NotiContainer id="notification-screen" onClick={() => navigate(-1)}>
      <NotiModalContent onClick={(e) => e.stopPropagation()}>
        {/* 우측 상단 닫기 X 버튼 */}
        <ClosePageButton onClick={() => navigate(-1)} aria-label="이전 화면으로 돌아가기" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </ClosePageButton>

        <NotiMain>
          <NotiIntro aria-labelledby="noti-page-title">
            <NotiPageTitle id="noti-page-title">알림</NotiPageTitle>
            <NotiPageDesc>비서 몽이가 보낸 소식들이에요.</NotiPageDesc>
          </NotiIntro>

          <NotiList aria-label="알림 목록">
            {notis.map((noti) => (
              <NotiCard
                key={noti.id}
                $cardBg={noti.cardBg}
                $isClosing={closingId === noti.id}
                aria-label={`${noti.title} 카드`}
              >
                <NotiCardTop>
                  <NotiIconWrap $iconBg={noti.iconBg} aria-hidden="true">
                    {noti.type === 'budget' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2C10.3 2 9 3.3 9 5V5.4C6.6 6.2 5 8.4 5 11V15L3 18H21L19 15V11C19 8.4 17.4 6.2 15 5.4V5C15 3.3 13.7 2 12 2Z"
                          stroke={noti.iconColor}
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.5 18.2C9.5 19.5 10.6 20.5 12 20.5C13.4 20.5 14.5 19.5 14.5 18.2"
                          stroke={noti.iconColor}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {noti.type === 'record' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                          fill={noti.iconColor}
                          stroke={noti.iconColor}
                          strokeWidth="0.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z"
                          fill={noti.iconColor}
                          opacity="0.6"
                          stroke={noti.iconColor}
                          strokeWidth="0.3"
                        />
                      </svg>
                    )}
                    {noti.type === 'report' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="16" rx="2" stroke={noti.iconColor} strokeWidth="1.8" />
                        <path d="M3 10H21" stroke={noti.iconColor} strokeWidth="1.8" />
                        <path d="M8 3V7" stroke={noti.iconColor} strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M16 3V7" stroke={noti.iconColor} strokeWidth="1.8" strokeLinecap="round" />
                        <rect x="7" y="13" width="4" height="4" rx="0.5" fill={noti.iconColor} opacity="0.5" />
                      </svg>
                    )}
                  </NotiIconWrap>
                  <NotiCardHeader>
                    <NotiCardTitle style={{ color: noti.iconColor }}>{noti.title}</NotiCardTitle>
                    <NotiCardTime dateTime="2026-08-05">{noti.time}</NotiCardTime>
                  </NotiCardHeader>
                </NotiCardTop>

                <NotiCardBody>
                  <NotiCardSummary>{noti.summary}</NotiCardSummary>
                  <NotiCardDetail style={{ whiteSpace: 'pre-line' }}>{noti.detail}</NotiCardDetail>
                </NotiCardBody>

                <NotiCardActions>
                  <BtnAction
                    $isPrimary={true}
                    onClick={() => navigate(noti.actionRoute)}
                    type="button"
                  >
                    {noti.actionText}
                  </BtnAction>
                  <BtnAction
                    $isPrimary={false}
                    $closeBg={noti.closeBtnBg}
                    $closeTextColor={noti.closeBtnTextColor}
                    onClick={() => handleCloseCard(noti.id)}
                    type="button"
                  >
                    닫기
                  </BtnAction>
                </NotiCardActions>
              </NotiCard>
            ))}
          </NotiList>
        </NotiMain>
      </NotiModalContent>
    </NotiContainer>
  );
};
export default NotificationPage;
