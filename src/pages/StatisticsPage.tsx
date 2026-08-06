import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { Toast } from '../components/Toast';
import mongBoring from '../assets/mascot/mong_boring.png';
import mongReport from '../assets/mascot/mong_report.png';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const StatisticsMain = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[6]}`};
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.serif};

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

/* Mascot bubble dialog */
const MongiAnalysis = styled.section`
  height: 180px;
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const MongiFaceWrap = styled.div`
  position: absolute;
  left: 0;
  top: 60px;
  width: 105px;
  height: 74px;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 390px) {
    width: 88px;
  }
`;

const MongiBubble = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 310px;
  min-height: 140px;
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};
  border: 1.5px solid ${({ theme }) => theme.colors.gray300};
  animation: ${slideUp} ${({ theme }) => theme.transition.default};

  &::before {
    content: '';
    position: absolute;
    left: -17px;
    top: 64px;
    border-top: 19px solid transparent;
    border-bottom: 19px solid transparent;
    border-right: 23px solid ${({ theme }) => theme.colors.surface};
  }

  &::after {
    content: '';
    position: absolute;
    left: -20px;
    top: 64px;
    border-top: 19px solid transparent;
    border-bottom: 19px solid transparent;
    border-right: 23px solid ${({ theme }) => theme.colors.gray300};
    z-index: -1;
  }

  @media (max-width: 390px) {
    width: 256px;
    padding: ${({ theme }) => theme.spacing[3]};
  }
`;

const BubbleTextMain = styled.p`
  font-family: ${({ theme }) => theme.fonts.hand};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.text};
  font-size: 19px;
  line-height: 1.5;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

const BubbleHighlight = styled.span`
  color: #B95865;
`;

const BubbleTextSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.hand};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  line-height: 1.6;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

/* Donut chart styles */
const DonutSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DonutWrap = styled.div`
  position: relative;
  width: 260px;
  height: 260px;

  @media (max-width: 390px) {
    width: 220px;
    height: 220px;
  }
`;

const DonutChart = styled.div<{ $gradient: string }>`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ $gradient }) => $gradient};
`;

const DonutCenter = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  width: 110px;
  height: 110px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.cream};
`;

const DonutCenterLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  margin-bottom: 2px;
`;

const DonutCenterValue = styled.p`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
`;

const LegendGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[2]}`};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const LegendItem = styled.div`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border: 1.5px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ $color }) => $color};
`;

const LegendText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

/* Detailed listing */
const DetailSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 20px;
  font-weight: 400;
`;

const DetailList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DetailCard = styled.li<{ $isFirst: boolean }>`
  min-height: 90px;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  background: ${({ theme, $isFirst }) =>
    $isFirst ? theme.colors.yellowLight : theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};
  border: 1.5px solid ${({ theme, $isFirst }) => ($isFirst ? theme.colors.yellow : 'transparent')};
  transition:
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const DetailIcon = styled.span<{ $bgColor: string }>`
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  background-color: ${({ $bgColor }) => $bgColor};

  svg {
    width: ${({ theme }) => theme.icon.md};
    height: ${({ theme }) => theme.icon.md};
  }
`;

const DetailContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailTitleText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
`;

const DetailDescText = styled.p`
  margin-top: 2px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DetailRight = styled.div`
  text-align: right;
`;

const DetailAmountText = styled.p`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

const DetailChangeText = styled.p<{ $type: 'up' | 'down' | 'same' }>`
  margin-top: 2px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 500;

  color: ${({ $type, theme }) => {
    if ($type === 'same') return theme.colors.textSub;
    if ($type === 'down') return theme.colors.primaryDark;
    return '#A64B5C'; // up
  }};
`;

/* Bottom report card */
const ReportCard = styled.section`
  position: relative;
  min-height: 380px;
  margin: ${({ theme }) => theme.spacing[4]} 0 0;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: ${({ theme }) => theme.colors.primaryBg};
  box-shadow: ${({ theme }) => theme.shadow.default};
  border: 1.5px solid ${({ theme }) => theme.colors.gray300};
  overflow: hidden;

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[3]};
  }
`;

const ReportHeader = styled.div`
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ReportTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 20px;
  font-weight: 400;
  white-space: nowrap;

  @media (max-width: 390px) {
    font-size: 19px;
  }
`;

const ReportMascot = styled.img`
  width: 60px;
  height: 67px;
  margin-top: -10px;
  object-fit: contain;
`;

const ReportBody = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 18px;
  line-height: 1.6;
  word-break: keep-all;
  margin-bottom: 76px; /* spacing for floating share button */

  @media (max-width: 390px) {
    font-size: 12px;
  }
`;

const BtnShareReport = styled.button`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  bottom: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.size.btnHeight};
  border-radius: ${({ theme }) => theme.radius.btn};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textWhite};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 0 ${({ theme }) => theme.colors.primaryDeep};
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: #95BC8B;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 ${({ theme }) => theme.colors.primaryDeep};
  }

  svg {
    width: ${({ theme }) => theme.icon.md};
    height: ${({ theme }) => theme.icon.md};
  }

  svg * {
    stroke: currentColor;
    stroke-width: 2;
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
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const categoryData: CategoryStat[] = [
    {
      id: 'food',
      label: '식비',
      percent: 45,
      color: '#F5A623',
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
      color: '#A64B5C',
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
      color: '#2F6FE0',
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
      color: '#D8D0B0',
      hasDetail: false,
      icon: 'shopping',
      detailTitle: '',
      desc: '',
      amount: 0,
      change: '',
      changeType: 'same',
    },
  ];

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });
  }, [setHeaderConfig]);

  const generateConicGradient = () => {
    let total = 0;
    const gradients = categoryData.map((item) => {
      const start = total;
      total += item.percent;
      return `${item.color} ${start}% ${total}%`;
    });
    return `conic-gradient(${gradients.join(',')})`;
  };

  const handleShareReport = async () => {
    const data = {
      title: '몽이의 말랑한 소비 리포트',
      text: '이번 달 총지출은 ₩1,240k예요. 식비 45%, 쇼핑 25%, 생활 20%, 기타 10%로 사용했어요.',
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${data.title}\n${data.text}`);
        setToastMsg('리포트 내용이 복사되었어요.');
        setToastOpen(true);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setToastMsg('리포트를 공유하지 못했어요.');
        setToastOpen(true);
      }
    }
  };

  const renderIcon = (iconName: string) => {
    if (iconName === 'food') {
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M8 2V10.5C8 11.6 7.1 12.5 6 12.5C4.9 12.5 4 11.6 4 10.5V2" stroke="#fff" />
          <line x1="6" y1="12.5" x2="6" y2="22" stroke="#fff" />
          <path d="M16 2C13.8 2 12 4.4 12 8C12 10.2 13.8 11.5 16 11.5V22" stroke="#fff" />
        </svg>
      );
    }
    if (iconName === 'shopping') {
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 8H19L18 20H6L5 8Z" stroke="#fff" />
          <path d="M8 8V6A4 4 0 0116 6V8" stroke="#fff" />
        </svg>
      );
    }
    // transport / life
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="13" rx="3" stroke="#fff" />
        <line x1="5" y1="10" x2="19" y2="10" stroke="#fff" />
        <circle cx="8.5" cy="19" r="1.6" fill="#fff" />
        <circle cx="15.5" cy="19" r="1.6" fill="#fff" />
      </svg>
    );
  };

  return (
    <StatisticsMain id="statistics-screen">
      <MongiAnalysis>
        <MongiFaceWrap>
          <img src={mongBoring} alt="풀이 죽은 몽이" />
        </MongiFaceWrap>
        <MongiBubble>
          <BubbleTextMain>
            이번 달은 식비가 조금 많았어요, <BubbleHighlight>냥냥!</BubbleHighlight>
          </BubbleTextMain>
          <BubbleTextSub>비서 몽이가 지난 30일의 소비 습관을 정리해왔어요.</BubbleTextSub>
        </MongiBubble>
      </MongiAnalysis>

      <DonutSection aria-label="카테고리별 지출 비율">
        <DonutWrap>
          <DonutChart $gradient={generateConicGradient()} />
          <DonutCenter>
            <DonutCenterLabel>총 지출</DonutCenterLabel>
            <DonutCenterValue>₩1,240k</DonutCenterValue>
          </DonutCenter>
        </DonutWrap>
        <LegendGrid>
          {categoryData.map((item) => (
            <LegendItem key={item.id}>
              <LegendDot $color={item.color} />
              <LegendText>
                {item.label} {item.percent}%
              </LegendText>
            </LegendItem>
          ))}
        </LegendGrid>
      </DonutSection>

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

      <ReportCard>
        <ReportHeader>
          <ReportTitle>✨ 몽이의 말랑한 리포트</ReportTitle>
          <ReportMascot src={mongReport} alt="리포트를 안내하는 몽이" />
        </ReportHeader>
        <ReportBody>
          이번 달 당신의 소비는 “풍성한 수확기”였어요.
          <br />
          <br />
          식비 지출이 늘어났지만, 그만큼 맛있는 것을 먹으며 스트레스를 풀었나봐요! 다음 달에는 쇼핑
          지출을 조금 줄여서 저축 씨앗을 더 심어보는 건 어떨까요?
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

      <Toast isOpen={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
    </StatisticsMain>
  );
};
export default StatisticsPage;
