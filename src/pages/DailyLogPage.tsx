import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';

// 가상 예시용 마스코트 이미지들 임포트
import mongHappy from '../assets/mascot/mong_happy.png';
import mongDefault from '../assets/mascot/mong_default.png';

const DailyLogContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.cream};
  display: flex;
  flex-direction: column;
`;

const DailyLogMain = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[4]}`};

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const DiaryCard = styled.section`
  width: 100%;
  padding: 24px 20px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};
  border: 1px solid #ECE7D4;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const DateSelector = styled.div`
  width: 100%;
  max-width: 320px;
  height: 54px;
  border-radius: 27px;
  background: #FFF0FA; /* 옅은 핑크 다이어리 탭 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 4px 10px rgba(255, 240, 250, 0.5);
  margin-bottom: 20px;
`;

const DateNavBtn = styled.button`
  color: #7D4B05;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.85);
  }
`;

const DateDisplay = styled.span`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 22px;
  font-weight: 700;
`;

const MonthText = styled.h2`
  color: #B31E2A; /* 시안 디자인 다크레드 */
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 16px;
  text-align: center;
`;

const CalendarTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #E8E2D0;
  background: #FFFFFF;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #FDFCF7;
  border-bottom: 1px solid #E8E2D0;
`;

const HeaderCell = styled.div`
  padding: 8px 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 15px;
  color: #5C524B;
  font-weight: 700;
  border-right: 1px solid #E8E2D0;

  &:last-child {
    border-right: 0;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(58px, auto);
`;

const CalendarCell = styled.div`
  position: relative;
  border-right: 1px solid #E8E2D0;
  border-bottom: 1px solid #E8E2D0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  min-height: 58px;

  &:nth-child(7n) {
    border-right: 0;
  }
`;

const DayNumber = styled.span<{ $isHeaderEmpty?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isHeaderEmpty }) => ($isHeaderEmpty ? '#C4C0B4' : '#2F2F2F')};
  align-self: flex-start;
  margin-bottom: 2px;
`;

const CellContent = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ImageBadge = styled.div<{ $src: string }>`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 0px;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
`;

const IconBadge = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);

  svg {
    width: 18px;
    height: 18px;
    color: #906212;
  }

  svg * {
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linejoin: round;
  }
  
  svg > path:first-child:last-child {
    fill: currentColor;
    stroke: none;
  }
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5C524B;
  font-weight: 500;
`;

const LegendColor = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

const SummaryCard = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 28px;
  background: #FFF0FA; /* 옅은 핑크 테두리 카드 */
  border: 1px solid #EFDDEB;
  box-shadow: 0 4px 15px rgba(239, 221, 235, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoBox = styled.div<{ $bg: string; $color: string }>`
  flex: 1;
  height: 52px;
  border-radius: 26px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 17px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

const EyeToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  width: 24px;
  height: 24px;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

const LogButton = styled.button`
  width: 100%;
  height: 54px;
  border-radius: 12px;
  background-color: #85AE7B;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 20px;
  letter-spacing: 0.5px;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #749D6A;
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

export const DailyLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAmountHidden, setIsAmountHidden] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const existingStr = localStorage.getItem('expenses') || '[]';
    try {
      setExpenses(JSON.parse(existingStr));
    } catch {
      setExpenses([]);
    }
  }, []);

  // 8월(August) 캘린더 생성에 필요한 셀 구성 목록
  // 2026년 8월 1일은 토요일이므로 1일 전에는 5개의 '-' 셀이 위치합니다. (일, 월, 화, 수, 목, 금)
  const prefixDays = ['-', '-', '-', '-', '-', '-'];
  const monthDays = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const suffixDays = ['-']; // 31일 월요일 이후 화~토 (6개 칸)
  const totalDays = [...prefixDays, ...monthDays, ...suffixDays];

  // 각 카테고리별 SVG
  const categorySvgs: { [key: string]: React.ReactNode } = {
    food: (
      <svg viewBox="0 0 24 24">
        <path d="M7 3v7a4 4 0 003 3.87V21a1 1 0 102 0v-7.13A4 4 0 0015 10V3a1 1 0 00-2 0v5h-1V3a1 1 0 00-2 0v5H9V3a1 1 0 00-2 0zm11 0a1 1 0 00-1 1v6a3 3 0 003 3h1v8a1 1 0 102 0V4a1 1 0 00-1-1h-4z" />
      </svg>
    ),
    life: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M19 10v9a2 2 0 01-2 2H7a2 2 0 01-2-2v-9a1 1 0 01.3-.7l6-6a1 1 0 011.4 0l6 6a1 1 0 01.3.7z" stroke="currentColor" />
        <rect x="10" y="14" width="4" height="7" stroke="currentColor" />
      </svg>
    ),
    transport: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="13" rx="3" stroke="currentColor" />
        <line x1="5" y1="10" x2="19" y2="10" stroke="currentColor" />
        <circle cx="8.5" cy="19" r="1.5" stroke="currentColor" />
        <circle cx="15.5" cy="19" r="1.5" stroke="currentColor" />
      </svg>
    ),
    culture: (
      <svg viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="7" rx="7" ry="3" stroke="currentColor" />
        <path d="M5 7v4c0 1.66 3.13 3 7 3s7-1.34 7-3V7" stroke="currentColor" />
      </svg>
    ),
    etc: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" />
      </svg>
    )
  };

  // 카테고리별 원형 배지 배경색 매핑
  const categoryColors: { [key: string]: string } = {
    food: '#FFE4E4', // 식비 (핑크)
    life: '#FFF39B', // 생활 (노랑)
    transport: '#EBF4FF', // 교통 (하늘)
    culture: '#FFF9E3', // 문화 (크림)
    etc: '#EEEAE4' // 기타 (그레이)
  };

  // 8월(August)에 매핑되는 지출 데이터를 얻습니다.
  const getExpenseForDay = (dayStr: string) => {
    const dayNum = parseInt(dayStr, 10);
    // 우선 로컬스토리지에서 8월에 저장된 지출을 매핑해봅니다.
    const userExpense = expenses.find((exp) => {
      const date = new Date(exp.createdAt);
      // 디폴트로 8월 지출 매핑
      return date.getMonth() === 7 && date.getDate() === dayNum;
    });

    if (userExpense) {
      return {
        image: userExpense.image || null,
        category: userExpense.category || 'etc',
        amount: userExpense.amount,
        isCustom: true
      };
    }

    // 로컬 데이터가 없을 시 시안 디자인과 동일한 예시 데이터 반환 (Fallback)
    if (dayStr === '01') {
      return { image: mongHappy, category: 'culture', isCustom: false };
    }
    if (dayStr === '03') {
      return { image: null, category: 'culture', isCustom: false }; // 커피 컵 아이콘
    }
    if (dayStr === '04') {
      return { image: null, category: 'life', isCustom: false }; // 쇼핑백 아이콘
    }
    if (dayStr === '05') {
      return { image: mongDefault, category: 'life', isCustom: false };
    }
    if (dayStr === '07') {
      return { image: null, category: 'transport', isCustom: false }; // 나뭇잎/물방울 아이콘
    }
    if (dayStr === '10') {
      return { image: null, category: 'food', isCustom: false }; // 포크/나이프 아이콘
    }

    return null;
  };

  // 이번 달 총 지출 금액 구하기
  const getAugustTotal = () => {
    // 8월에 해당하는 로컬 지출 합산
    const augustExpenses = expenses.filter((exp) => new Date(exp.createdAt).getMonth() === 7);
    if (augustExpenses.length > 0) {
      return augustExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    }
    // 없을 시 기본 예시 데이터
    return 254000;
  };

  // 이번 달 기록 일수 구하기
  const getAugustDaysCount = () => {
    // 8월에 해당하는 로컬 지출 일수 계산
    const augustExpenses = expenses.filter((exp) => new Date(exp.createdAt).getMonth() === 7);
    const uniqueDays = new Set(augustExpenses.map((exp) => new Date(exp.createdAt).getDate()));
    
    // 기본 예시 데이터 일수(6일) + 동적 날짜 추가
    const defaultDays = 6;
    return defaultDays + uniqueDays.size;
  };

  const DailyLogHeaderIcon = (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2B4C20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    </svg>
  );

  return (
    <DailyLogContainer id="daily-log-screen">
      <Header
        showBackButton={true}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {DailyLogHeaderIcon}
            <span style={{ fontFamily: 'Jua', fontSize: '22px', color: '#2B4C20', fontWeight: 'bold' }}>
              데일리 로그
            </span>
          </span>
        }
        onRightClick={() => window.alert('새로운 알림이 없습니다.')}
      />
      <DailyLogMain>
        <DiaryCard aria-label="다이어리 달력 카드">
          <DateSelector>
            <DateNavBtn aria-label="이전 달">&lt;</DateNavBtn>
            <DateDisplay>2026년 8월</DateDisplay>
            <DateNavBtn aria-label="다음 달">&gt;</DateNavBtn>
          </DateSelector>

          <MonthText>AUGUST</MonthText>

          <CalendarTable>
            <WeekHeader>
              <HeaderCell>일</HeaderCell>
              <HeaderCell>월</HeaderCell>
              <HeaderCell>화</HeaderCell>
              <HeaderCell>수</HeaderCell>
              <HeaderCell>목</HeaderCell>
              <HeaderCell>금</HeaderCell>
              <HeaderCell>토</HeaderCell>
            </WeekHeader>
            <CalendarGrid>
              {totalDays.map((day, idx) => {
                const isEmpty = day === '-';
                const expense = !isEmpty ? getExpenseForDay(day) : null;

                return (
                  <CalendarCell key={idx}>
                    <DayNumber $isHeaderEmpty={isEmpty}>{day}</DayNumber>
                    <CellContent>
                      {expense && (
                        <>
                          {expense.image ? (
                            <ImageBadge $src={expense.image} aria-label="사진 기록 에셋" />
                          ) : (
                            <IconBadge $color={categoryColors[expense.category] || '#EEEAE4'} aria-label="일반 지출 카테고리 아이콘">
                              {categorySvgs[expense.category] || categorySvgs.etc}
                            </IconBadge>
                          )}
                        </>
                      )}
                    </CellContent>
                  </CalendarCell>
                );
              })}
            </CalendarGrid>
          </CalendarTable>

          <LegendRow>
            <LegendItem>
              <LegendColor $color="#0B56A4" />
              <span>사진 기록</span>
            </LegendItem>
            <LegendItem>
              <LegendColor $color="#E0D2AC" />
              <span>일반 지출</span>
            </LegendItem>
          </LegendRow>
        </DiaryCard>

        {/* 하단 정보 및 로그작성 요약 영역 */}
        <SummaryCard>
          <InfoRow>
            <InfoBox $bg="#EAE6F8" $color="#5522AA">
              <span>이번 달 기록</span>
              <span style={{ fontSize: '22px', fontWeight: 'bold' }}>{getAugustDaysCount()}</span>
              <span>일</span>
            </InfoBox>

            <InfoBox $bg="#FFEAD6" $color="#CC5500">
              <EyeToggleBtn
                onClick={() => setIsAmountHidden(!isAmountHidden)}
                aria-label={isAmountHidden ? "금액 표시하기" : "금액 숨기기"}
                type="button"
              >
                {isAmountHidden ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92C21.84 15.39 23 13.82 23 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.47-.8c.79 0 1.53.2 2.2.53L12.9 11.2c-.21.05-.43.08-.65.08-.22 0-.44-.03-.65-.08L9.8 9.47c.33-.67.53-1.41.53-2.2 0-.22-.03-.44-.08-.65l1.55 1.55c.05.21.08.43.08.65z" />
                  </svg>
                )}
              </EyeToggleBtn>
              <span>
                {isAmountHidden ? "총 지출 금액 보기" : `총 지출 ${getAugustTotal().toLocaleString('ko-KR')}원`}
              </span>
            </InfoBox>
          </InfoRow>

          <LogButton onClick={() => navigate('/expense/write')} aria-label="오늘의 로그 남기기" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>오늘의 로그 남기기</span>
          </LogButton>
        </SummaryCard>
      </DailyLogMain>

      <BottomNavigation />
    </DailyLogContainer>
  );
};

export default DailyLogPage;
