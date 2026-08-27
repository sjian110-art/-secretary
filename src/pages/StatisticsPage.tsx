import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { BottomNavigation } from '../components/BottomNavigation';
import mongLying from '../assets/mascot/mong_lying.png';
import mongHappy from '../assets/mascot/mong_happy.png';
import mongReport from '../assets/mascot/mong_report.png';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const StatisticsContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.cream};
  display: flex;
  flex-direction: column;
`;

const StatisticsMain = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[4]}`};
  display: flex;
  flex-direction: column;

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

/* 탭 스위처 */
const TabContainer = styled.div`
  background-color: #FFFDF5;
  border: 1.5px solid #ECE7D4;
  border-radius: 24px;
  display: flex;
  padding: 4px;
  gap: 4px;
  width: 190px;
  margin: 0 auto 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  border-radius: 20px;
  border: 0;
  padding: 8px 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 700;
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background-color: #C2E2C0; /* 연두색 활성화 탭 */
          color: #2B4C20;
          box-shadow: 0 2px 6px rgba(194, 226, 192, 0.4);
        `
      : css`
          background-color: transparent;
          color: #8C8C8C;
        `}
`;

/* Mascot bubble dialog */
const MongiAnalysis = styled.section`
  height: 150px;
  position: relative;
  margin-bottom: 24px;
`;

const MongiFaceWrap = styled.div`
  position: absolute;
  left: 0;
  top: 40px;
  width: 105px;
  height: 80px;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 390px) {
    width: 90px;
  }
`;

const MongiBubble = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 90px);
  min-height: 110px;
  padding: 16px;
  border-radius: 28px;
  background: #FFFDF5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1.5px solid #ECE7D4;
  animation: ${slideUp} 0.4s ease-out;

  &::before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50px;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 16px solid #FFFDF5;
  }

  &::after {
    content: '';
    position: absolute;
    left: -18px;
    top: 50px;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 16px solid #ECE7D4;
    z-index: -1;
  }

  @media (max-width: 390px) {
    width: calc(100% - 78px);
    padding: 12px 14px;
  }
`;

const BubbleTextMain = styled.p`
  font-family: ${({ theme }) => theme.fonts.hand};
  margin-bottom: 6px;
  color: #21160F;
  font-size: 19px;
  line-height: 1.45;

  @media (max-width: 390px) {
    font-size: 16px;
  }
`;

const BubbleHighlight = styled.span`
  color: #CC4B5C; /* 냠냠 포인트 레드 컬러 */
  font-weight: 700;
`;

const BubbleTextSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.hand};
  color: #5C524B;
  font-size: 16px;
  line-height: 1.5;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

/* 소비 총액 요약 카드 */
const TotalSpentCard = styled.div`
  background-color: #FFFCEE; /* 옅은 크림 노랑 카드 */
  border-radius: 28px;
  border: 1px solid #FFF5D0;
  text-align: center;
  padding: 20px 24px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(255, 252, 238, 0.5);
`;

const TotalSpentLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: #8C8A79;
  font-weight: 700;
  margin-bottom: 6px;
`;

const TotalSpentValue = styled.p`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.5px;

  span {
    font-size: 26px;
    font-weight: 500;
    padding-right: 4px;
  }
`;

/* 수직형 막대 게이지 차트 (월간 전용) */
const VerticalChartSection = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 180px;
  margin-bottom: 28px;
  padding: 0 10px;
`;

const ChartBarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
`;

const BarColumnLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 15px;
  color: #5C524B;
  font-weight: 700;
  margin-bottom: 6px;
`;

const BarBubble = styled.div<{ $bgColor: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${({ $bgColor }) => $bgColor};
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
`;

const BarTrack = styled.div`
  width: 12px;
  height: 90px;
  background-color: #ECE7D4;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BarFill = styled.div<{ $height: number; $bgColor: string }>`
  width: 100%;
  height: ${({ $height }) => $height}%;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 6px;
  transition: height 0.6s ease-out;
`;

const BarStand = styled.div`
  background-color: #E2DCBF;
  border-radius: 0 0 14px 14px;
  width: 42px;
  height: 14px;
  margin-top: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

/* 연간 도넛형 버블 차트 (연간 전용) */
const BubbleChartSection = styled.section`
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
`;

const BubblePlate = styled.div`
  background-color: #FFFDF5;
  border-radius: 50%;
  width: 250px;
  height: 250px;
  position: relative;
  border: 1.5px solid #ECE7D4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(236, 231, 212, 0.2);

  @media (max-width: 390px) {
    width: 220px;
    height: 220px;
  }
`;

const PlateLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: #8C8A79;
  font-weight: 700;
  margin-bottom: 4px;
`;

const PlateValue = styled.p`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 24px;
  font-weight: 800;

  span {
    font-size: 18px;
    font-weight: 500;
  }
`;

/* 입체 겹침 버블들 */
const FloatingBubble = styled.div<{
  $width: number;
  $bgColor: string;
  $borderColor: string;
  $color: string;
  $top?: string;
  $bottom?: string;
  $left?: string;
  $right?: string;
}>`
  width: ${({ $width }) => $width}px;
  height: ${({ $width }) => $width}px;
  border-radius: 50%;
  background-color: ${({ $bgColor }) => $bgColor};
  border: 2px solid ${({ $borderColor }) => $borderColor};
  color: ${({ $color }) => $color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  z-index: 5;

  ${({ $top }) => $top && `top: ${$top};`}
  ${({ $bottom }) => $bottom && `bottom: ${$bottom};`}
  ${({ $left }) => $left && `left: ${$left};`}
  ${({ $right }) => $right && `right: ${$right};`}
`;

const FloatingLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 15px;
  font-weight: 700;
`;

const FloatingPercent = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 800;
`;

/* 카테고리 비율 배지 그리드 */
const LegendGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
`;

const LegendItem = styled.div`
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #ECE7D4;
  border-radius: 24px;
  background: #FFFDF5;
  box-shadow: 0 2px 6px rgba(236, 231, 212, 0.1);
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const LegendText = styled.span`
  color: #5C524B;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
`;

const LegendPercent = styled.span`
  margin-left: auto;
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
`;

/* Detailed listing */
const DetailSection = styled.section`
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 12px 0;
  color: #2B4C20;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 19px;
  font-weight: 700;
`;

const DetailList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailCard = styled.li<{ $isFirst: boolean }>`
  min-height: 80px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 20px;
  background: ${({ $isFirst }) =>
    $isFirst ? '#FFFCEE' : '#FFFFFF'};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  border: 1.5px solid ${({ $isFirst }) => ($isFirst ? '#FFF5D0' : 'transparent')};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 390px) {
    padding-inline: 12px;
  }
`;

const DetailIcon = styled.span<{ $bgColor: string }>`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background-color: ${({ $bgColor }) => $bgColor};

  svg {
    width: 22px;
    height: 22px;
  }
`;

const DetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailTitleText = styled.p`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 700;
`;

const DetailDescText = styled.p`
  margin-top: 3px;
  overflow: hidden;
  color: #8C8A79;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DetailRight = styled.div`
  text-align: right;
`;

const DetailAmountText = styled.p`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
`;

const DetailChangeText = styled.p<{ $type: 'up' | 'down' | 'same' }>`
  margin-top: 3px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;

  color: ${({ $type }) => {
    if ($type === 'same') return '#8C8A79';
    if ($type === 'down') return '#27823A'; // down (green)
    return '#CC4B5C'; // up (red)
  }};
`;

/* Bottom report card */
const ReportCard = styled.section<{ $isYearly: boolean }>`
  position: relative;
  min-height: 340px;
  margin: 16px 0 0;
  padding: 24px;
  border-radius: 28px;
  background: ${({ $isYearly }) => ($isYearly ? '#E5CDCD' : '#E5E1CD')};
  border: 1.5px solid ${({ $isYearly }) => ($isYearly ? '#DCC5C5' : '#DCD7C5')};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ReportTitle = styled.h2`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 19px;
  font-weight: 700;
  white-space: nowrap;
`;

const ReportMascot = styled.img`
  width: 58px;
  height: 64px;
  margin-top: -10px;
  object-fit: contain;
`;

const ReportBody = styled.p`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 17px;
  line-height: 1.6;
  word-break: keep-all;
  margin-bottom: 70px;
`;

const BtnShareReport = styled.button`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #83AC80; /* 시안 연녹색 버튼 */
  color: #FFFFFF;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 0 #6C8E69;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background-color: #749A71;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #6C8E69;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  svg * {
    stroke: currentColor;
    stroke-width: 2.5;
  }
`;

interface CategoryStat {
  id: string;
  label: string;
  percent: number;
  color: string;
  hasDetail: boolean;
  icon: 'food' | 'shopping' | 'transport';
  detailTitle: string;
  desc: string;
  amount: number;
  change: string;
  changeType: 'up' | 'down' | 'same';
}

export const StatisticsPage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  
  // 월간/연간 탭 상태
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  // 소비 총액 동적 로드 상태
  const [monthlyTotal, setMonthlyTotal] = useState(1240000);
  const [yearlyTotal, setYearlyTotal] = useState(12450000);

  const categoryData: CategoryStat[] = [
    {
      id: 'food',
      label: '식비',
      percent: 45,
      color: '#EAA958', /* 주황 */
      hasDetail: true,
      icon: 'food',
      detailTitle: '식비',
      desc: '맛집 탐방과 배달음식',
      amount: 558000,
      change: '+12% vs 지난달',
      changeType: 'up',
    },
    {
      id: 'shopping',
      label: '쇼핑',
      percent: 25,
      color: '#EEA9BC', /* 핑크 */
      hasDetail: true,
      icon: 'shopping',
      detailTitle: '쇼핑',
      desc: '나를 위한 작은 선물들',
      amount: 310000,
      change: '-5% vs 지난달',
      changeType: 'down',
    },
    {
      id: 'life',
      label: '생활',
      percent: 20,
      color: '#95B2EA', /* 파랑 */
      hasDetail: true,
      icon: 'transport',
      detailTitle: '생활/교통',
      desc: '출퇴근과 공과금',
      amount: 248000,
      change: '동일함',
      changeType: 'same',
    },
    {
      id: 'etc',
      label: '기타',
      percent: 10,
      color: '#C0C5C2', /* 회색 */
      hasDetail: false,
      icon: 'shopping',
      detailTitle: '',
      desc: '',
      amount: 0,
      change: '',
      changeType: 'same',
    },
  ];

  // 로컬스토리지에서 지출 계산 연동
  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
    });

    const stored = localStorage.getItem('expenses');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // 이번 달(8월) 지출 총합 구하기
        const currentMonthSum = parsed
          .filter((item: any) => item.createdAt && item.createdAt.includes('-08-'))
          .reduce((acc: number, curr: any) => acc + curr.amount, 0);
        
        if (currentMonthSum > 0) {
          setMonthlyTotal(currentMonthSum);
        }

        // 전체 지출 합산 구하기
        const totalSum = parsed.reduce((acc: number, curr: any) => acc + curr.amount, 0);
        if (totalSum > 0) {
          setYearlyTotal(totalSum);
        }
      } catch (e) {
        // 무시
      }
    }
  }, [setHeaderConfig]);

  const handleShareReport = async () => {
    const data = {
      title: activeTab === 'monthly' ? '몽이의 말랑한 월간 소비 리포트' : '몽이의 말랑한 연말결산 리포트',
      text: activeTab === 'monthly'
        ? `이번 달 총지출은 ₩${monthlyTotal.toLocaleString()} 이에요. 식비 45%, 쇼핑 25%, 생활 20%, 기타 10%로 사용했어요.`
        : `올해 총지출은 ₩${yearlyTotal.toLocaleString()} 이에요. 식비 45%, 쇼핑 25%, 생활 20%, 기타 10%로 사용했어요.`,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${data.title}\n${data.text}`);
        window.alert('리포트 내용이 클립보드에 복사되었어요.');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        window.alert('리포트를 공유하지 못했어요.');
      }
    }
  };

  const renderIcon = (iconName: string) => {
    if (iconName === 'food') {
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M8 2V10.5C8 11.6 7.1 12.5 6 12.5C4.9 12.5 4 11.6 4 10.5V2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="6" y1="12.5" x2="6" y2="22" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M16 2C13.8 2 12 4.4 12 8C12 10.2 13.8 11.5 16 11.5V22" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    }
    if (iconName === 'shopping') {
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 8H19L18 20H6L5 8Z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M8 8V6A4 4 0 0116 6V8" stroke="#fff" strokeWidth="2.2" />
        </svg>
      );
    }
    // transport / life
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="13" rx="3" stroke="#fff" strokeWidth="2.2" />
        <line x1="5" y1="10" x2="19" y2="10" stroke="#fff" strokeWidth="2.2" />
        <circle cx="8.5" cy="19" r="1.6" fill="#fff" />
        <circle cx="15.5" cy="19" r="1.6" fill="#fff" />
      </svg>
    );
  };

  return (
    <StatisticsContainer id="statistics-screen">
      <StatisticsMain>
        {/* 월간 / 연간 탭 버튼 */}
        <TabContainer>
          <TabButton
            $isActive={activeTab === 'monthly'}
            onClick={() => setActiveTab('monthly')}
            type="button"
          >
            월간
          </TabButton>
          <TabButton
            $isActive={activeTab === 'yearly'}
            onClick={() => setActiveTab('yearly')}
            type="button"
          >
            연간
          </TabButton>
        </TabContainer>

        {activeTab === 'monthly' ? (
          /* ========================================================
             1) 월간 통계 뷰
             ======================================================== */
          <>
            <MongiAnalysis>
              <MongiFaceWrap>
                <img src={mongLying} alt="누워있는 몽이" />
              </MongiFaceWrap>
              <MongiBubble>
                <BubbleTextMain>
                  이번 달은 식비가 조금 많았어요, <BubbleHighlight>냠냠!</BubbleHighlight>
                </BubbleTextMain>
                <BubbleTextSub>비서 몽이가 지난 30일의 소비 습관을 정리해왔어요.</BubbleTextSub>
              </MongiBubble>
            </MongiAnalysis>

            <TotalSpentCard>
              <TotalSpentLabel>이번 달 총 지출</TotalSpentLabel>
              <TotalSpentValue>
                <span>₩</span>
                {monthlyTotal.toLocaleString('ko-KR')}
              </TotalSpentValue>
            </TotalSpentCard>

            {/* 수직형 막대 그래프 */}
            <VerticalChartSection>
              {categoryData.map((item) => (
                <ChartBarColumn key={item.id}>
                  <BarColumnLabel>{item.label}</BarColumnLabel>
                  <BarBubble $bgColor={item.color}>{item.percent}%</BarBubble>
                  <BarTrack>
                    <BarFill $height={item.percent * 1.8} $bgColor={item.color} />
                  </BarTrack>
                  <BarStand />
                </ChartBarColumn>
              ))}
            </VerticalChartSection>

            {/* 비율 배지 리스트 */}
            <LegendGrid>
              {categoryData.map((item) => (
                <LegendItem key={item.id}>
                  <LegendDot $color={item.color} />
                  <LegendText>{item.label}</LegendText>
                  <LegendPercent>{item.percent}%</LegendPercent>
                </LegendItem>
              ))}
            </LegendGrid>

            {/* 지출 상세보기 */}
            <DetailSection>
              <SectionTitle>지출 상세보기</SectionTitle>
              <DetailList>
                {categoryData
                  .filter((item) => item.hasDetail)
                  .map((item, index) => (
                    <DetailCard key={item.id} $isFirst={index === 0}>
                      <DetailIcon $bgColor={item.color}>{renderIcon(item.icon)}</DetailIcon>
                      <DetailContent>
                        <DetailTitleText>{item.detailTitle}</DetailTitleText>
                        <DetailDescText>{item.desc}</DetailDescText>
                      </DetailContent>
                      <DetailRight>
                        <DetailAmountText>₩{item.amount.toLocaleString('ko-KR')}</DetailAmountText>
                        <DetailChangeText $type={item.changeType}>{item.change}</DetailChangeText>
                      </DetailRight>
                    </DetailCard>
                  ))}
              </DetailList>
            </DetailSection>

            {/* 몽이의 말랑한 리포트 */}
            <ReportCard $isYearly={false}>
              <ReportHeader>
                <ReportTitle>✨ 몽이의 말랑한 리포트</ReportTitle>
                <ReportMascot src={mongReport} alt="리포트를 안내하는 몽이" />
              </ReportHeader>
              <ReportBody>
                이번 달 당신의 소비는 “풍성한 수확기”였어요.
                <br />
                <br />
                식비 지출이 늘어났지만, 그만큼 맛있는 것을 먹으며 스트레스를 풀었나봐요! 다음 달에는 쇼핑 지출을 조금 줄여서 저축 씨앗을 더 심어보는 건 어떨까요?
              </ReportBody>
              <BtnShareReport type="button" onClick={handleShareReport}>
                <span>리포트 공유하기</span>
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="6" cy="12" r="2.6" />
                  <circle cx="18" cy="6" r="2.6" />
                  <circle cx="18" cy="18" r="2.6" />
                  <line x1="8.2" y1="10.8" x2="15.8" y2="7.2" />
                  <line x1="8.2" y1="13.2" x2="15.8" y2="16.8" />
                </svg>
              </BtnShareReport>
            </ReportCard>
          </>
        ) : (
          /* ========================================================
             2) 연간 통계 뷰
             ======================================================== */
          <>
            {/* 입체 버블이 포함된 도넛형 플레이트 */}
            <BubbleChartSection>
              <BubblePlate>
                <PlateLabel>올해 총 지출</PlateLabel>
                <PlateValue>
                  <span>₩</span>
                  {yearlyTotal.toLocaleString('ko-KR')}
                </PlateValue>

                {/* 4방향 겹쳐진 부유형 버블 */}
                {/* 식비 45% (우상) */}
                <FloatingBubble
                  $width={82}
                  $bgColor="#FFE8DF"
                  $borderColor="#EBA958"
                  $color="#7A3B4D"
                  $right="-22px"
                  $top="-10px"
                >
                  <FloatingLabel>식비</FloatingLabel>
                  <FloatingPercent>45%</FloatingPercent>
                </FloatingBubble>

                {/* 쇼핑 25% (우하) */}
                <FloatingBubble
                  $width={70}
                  $bgColor="#FFEAEF"
                  $borderColor="#EEA9BC"
                  $color="#7A3B4D"
                  $right="-14px"
                  $bottom="26px"
                >
                  <FloatingLabel>쇼핑</FloatingLabel>
                  <FloatingPercent>25%</FloatingPercent>
                </FloatingBubble>

                {/* 생활 20% (좌하) */}
                <FloatingBubble
                  $width={66}
                  $bgColor="#EBF4FF"
                  $borderColor="#95B2EA"
                  $color="#2A5A9F"
                  $left="-18px"
                  $bottom="36px"
                >
                  <FloatingLabel>생활</FloatingLabel>
                  <FloatingPercent>20%</FloatingPercent>
                </FloatingBubble>

                {/* 기타 10% (좌상) */}
                <FloatingBubble
                  $width={54}
                  $bgColor="#F1F3F2"
                  $borderColor="#C0C5C2"
                  $color="#5C5C5C"
                  $left="-12px"
                  $top="18px"
                >
                  <FloatingLabel>기타</FloatingLabel>
                  <FloatingPercent>10%</FloatingPercent>
                </FloatingBubble>
              </BubblePlate>
            </BubbleChartSection>

            {/* 비율 배지 리스트 */}
            <LegendGrid>
              {categoryData.map((item) => (
                <LegendItem key={item.id}>
                  <LegendDot $color={item.color} />
                  <LegendText>{item.label}</LegendText>
                  <LegendPercent>{item.percent}%</LegendPercent>
                </LegendItem>
              ))}
            </LegendGrid>

            {/* 몽이의 연말결산 리포트 */}
            <ReportCard $isYearly={true}>
              <ReportHeader>
                <ReportTitle>💖 몽이의 연말결산</ReportTitle>
                <ReportMascot src={mongHappy} alt="행복한 하트눈 몽이" />
              </ReportHeader>
              <ReportBody>
                올해 당신의 소비는 “풍성한 수확기”였어요.
                <br />
                <br />
                식비 지출이 늘어났지만, 그만큼 맛있는 것을 먹으며 스트레스를 풀었나봐요! 다음 달에는 쇼핑 지출을 조금 줄여서 저축 씨앗을 더 심어보는 건 어떨까요?
              </ReportBody>
              <BtnShareReport type="button" onClick={handleShareReport}>
                <span>리포트 공유하기</span>
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="6" cy="12" r="2.6" />
                  <circle cx="18" cy="6" r="2.6" />
                  <circle cx="18" cy="18" r="2.6" />
                  <line x1="8.2" y1="10.8" x2="15.8" y2="7.2" />
                  <line x1="8.2" y1="13.2" x2="15.8" y2="16.8" />
                </svg>
              </BtnShareReport>
            </ReportCard>
          </>
        )}
      </StatisticsMain>

      <BottomNavigation />
    </StatisticsContainer>
  );
};

export default StatisticsPage;
