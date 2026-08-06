import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import mongHappy from '../assets/mascot/mong_happy.png';

interface ExpenseItem {
  id: number;
  amount: number;
  category: string; // 'food' | 'shopping' | 'transport' | 'life' | 'culture' | 'etc'
  categoryName: string;
  memo: string;
  createdAt: string; // ISO String
}

const HistoryMain = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} 130px`};
  font-family: ${({ theme }) => theme.fonts.serif};

  @media (max-width: 380px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const ExpenseSummary = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ExpenseSummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ExpenseLabel = styled.h2`
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 380px) {
    font-size: 14px;
  }
`;

const MonthSelector = styled.div`
  position: relative;
  z-index: 20;
`;

const MonthDropdownBtn = styled.button<{ $expanded: boolean }>`
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.yellowLight};
  font-size: 14px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: background-color ${({ theme }) => theme.transition.default};

  svg {
    width: 20px;
    height: 20px;
    transition: transform ${({ theme }) => theme.transition.default};
    transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  }

  svg path {
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const MonthMenu = styled.div`
  position: absolute;
  top: 46px;
  left: 0;
  width: 200px;
  padding: ${({ theme }) => theme.spacing[2]};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.cardSm};
  background: #FFFDF0;
  box-shadow: ${({ theme }) => theme.shadow.default};
`;

const MonthOption = styled.button<{ $isSelected: boolean }>`
  height: 33px;
  border-radius: ${({ theme }) => theme.radius.tag};
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : theme.colors.yellowLight};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.textWhite : theme.colors.textSub};
  font-size: 13px;
  font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 400)};
  transition: background-color ${({ theme }) => theme.transition.default};

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.primaryBg};
  }
`;

const ExpenseAmount = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 50px;
  line-height: 1;

  @media (max-width: 380px) {
    font-size: 44px;
  }
`;

const WonSign = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 44px;
  font-weight: 500;

  @media (max-width: 380px) {
    font-size: 38px;
  }
`;

const CategoryFilters = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 380px) {
    gap: 7px;
  }
`;

const FilterBtn = styled.button<{ $isActive: boolean }>`
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.creamDark};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.textWhite : theme.colors.textSub};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: ${({ theme, $isActive }) => ($isActive ? theme.shadow.default : theme.shadow.sm)};
  transition:
    background-color ${({ theme }) => theme.transition.default},
    color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : theme.colors.primaryBg};
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: 380px) {
    font-size: 12px;
  }
`;

const TransactionGroups = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DateGroupSection = styled.section<{ $isPast?: boolean }>``;

const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DateGroupTitle = styled.h3<{ $isPast?: boolean }>`
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  background: ${({ $isPast, theme }) =>
    $isPast
      ? `linear-gradient(transparent 58%, ${theme.colors.yellowLight} 58%)`
      : 'linear-gradient(transparent 58%, #FFF4A1 58%)'};
`;

const DateGroupLine = styled.span`
  height: 2px;
  flex: 1;
  background: ${({ theme }) => theme.colors.gray300};
  border-radius: 2px;
`;

const TransactionList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TransactionCard = styled.li<{ $isPast?: boolean }>`
  min-height: 108px;
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: ${({ theme, $isPast }) =>
    $isPast ? theme.colors.yellowLight : '#FFF5A2'}; /* history-yellow */
  box-shadow: ${({ theme }) => theme.shadow.default};
  transition:
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 380px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

const TransactionIcon = styled.span<{ $type: string }>`
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;

  background: ${({ $type }) => {
    if ($type === 'food') return '#FFE897';
    if ($type === 'cafe') return '#D8E3FF';
    if ($type === 'shopping') return '#FFD7E0';
    return '#DED9B8'; // transport and others
  }};

  svg {
    width: 28px;
    height: 28px;
  }

  svg * {
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: ${({ $type }) => {
      if ($type === 'food') return '#8A6420';
      if ($type === 'cafe') return '#2F5FA8';
      if ($type === 'shopping') return '#C2477B';
      return '#5C6B4A';
    }};
  }

  circle {
    fill: #5C6B4A;
    stroke: none !important;
  }

  @media (max-width: 380px) {
    width: 46px;
    height: 46px;
    flex-basis: 46px;
  }
`;

const TransactionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TransactionTitle = styled.p`
  overflow: hidden;
  color: #181810;
  font-size: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 380px) {
    font-size: 17px;
  }
`;

const TransactionDesc = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 14px;

  @media (max-width: 380px) {
    font-size: 12px;
  }
`;

const TransactionAmountText = styled.p`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 380px) {
    font-size: 14px;
  }
`;

/* Bottom progress card */
const ProgressSummaryCard = styled.section`
  min-height: 256px;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[3]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: #FFF6D7;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.12), ${({ theme }) => theme.shadow.default};
`;

const MascotWrap = styled.div`
  width: 100px;
  height: 84px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProgressQuote = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 20px;
  color: #181810;
  text-align: center;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 16px;
  margin-top: ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #E9E1BD;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};
  transition: width ${({ theme }) => theme.transition.slow};
`;

const ProgressAmountText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  font-weight: 700;
`;

/* Floating action button */
const FabAdd = styled.button`
  position: fixed;
  right: max(calc((100vw - 480px) / 2 + 20px), 20px);
  bottom: 90px;
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.primaryDark};
  box-shadow: 0 6px 20px rgba(62, 100, 51, 0.30);
  z-index: 1001;
  transition:
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 24px rgba(62, 100, 51, 0.40);
  }

  &:active {
    transform: scale(0.94);
  }

  svg {
    width: ${({ theme }) => theme.icon.lg};
    height: ${({ theme }) => theme.icon.lg};
  }

  line {
    stroke: ${({ theme }) => theme.colors.textWhite};
    stroke-width: 2.2;
    stroke-linecap: round;
  }
`;

const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: 1,
    amount: 18500,
    category: 'food',
    categoryName: '식비',
    memo: '친구와 저녁 식사',
    createdAt: new Date('2026-10-24T18:30:00').toISOString(),
  },
  {
    id: 2,
    amount: 6200,
    category: 'food', // cafe
    categoryName: '식비',
    memo: '오트밀 라떼',
    createdAt: new Date('2026-10-24T14:15:00').toISOString(),
  },
  {
    id: 3,
    amount: 42000,
    category: 'shopping',
    categoryName: '쇼핑',
    memo: '장보기',
    createdAt: new Date('2026-10-23T19:00:00').toISOString(),
  },
  {
    id: 4,
    amount: 1250,
    category: 'transport',
    categoryName: '교통',
    memo: '출퇴근 이동',
    createdAt: new Date('2026-10-23T08:30:00').toISOString(),
  },
];

export const ExpenseHistoryPage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'food' | 'shopping' | 'transport'>('all');

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });

    // Load from LocalStorage
    const stored = localStorage.getItem('expenses');
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch {
        setExpenses(DEFAULT_EXPENSES);
      }
    } else {
      setExpenses(DEFAULT_EXPENSES);
      localStorage.setItem('expenses', JSON.stringify(DEFAULT_EXPENSES));
    }
  }, [setHeaderConfig]);

  // Click outside dropdown close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter list by category and month
  // Note: we can filter by the month value inside createdAt
  const getFilteredExpenses = () => {
    return expenses.filter((item) => {
      // const date = new Date(item.createdAt);
      // To match demo month selection: in a real app, it will filter by month.
      // But we will allow all demo data to display under month 8 for preview.
      const categoryMatch =
        filterCategory === 'all' ||
        item.category === filterCategory ||
        (filterCategory === 'food' && item.category === 'cafe');
      return categoryMatch;
    });
  };

  // Group by date
  const groupedExpenses = () => {
    const filtered = getFilteredExpenses();
    const groups: { [key: string]: { title: string; isPast: boolean; list: ExpenseItem[] } } = {};

    filtered.forEach((item) => {
      const date = new Date(item.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const key = `${year}-${month}-${day}`;

      if (!groups[key]) {
        // Mocking today/yesterday for default demo dates
        let title = `${month}월 ${day}일`;
        let isPast = false;
        if (day === 24) {
          title = `오늘 · ${month}월 ${day}일`;
        } else if (day === 23) {
          title = `어제 · ${month}월 ${day}일`;
          isPast = true;
        } else {
          isPast = true;
        }
        groups[key] = { title, isPast, list: [] };
      }
      groups[key].list.push(item);
    });

    return Object.values(groups);
  };

  // Calculate sum of active month expenses
  const totalMonthlySpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Budget progress calculations
  const totalBudget = 1200000;
  const usagePercent = Math.min(Math.round((totalMonthlySpent / totalBudget) * 100), 100);

  const getIconType = (category: string, memo: string) => {
    if (category === 'food') {
      if (memo.includes('카페') || memo.includes('라떼') || memo.includes('커피')) return 'cafe';
      return 'food';
    }
    if (category === 'shopping') return 'shopping';
    return 'transport';
  };

  const renderIcon = (type: string) => {
    if (type === 'food') {
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 2V10.5C8 11.6 7.1 12.5 6 12.5C4.9 12.5 4 11.6 4 10.5V2" />
          <line x1="6" y1="12.5" x2="6" y2="22" />
          <path d="M16 2C13.8 2 12 4.4 12 8C12 10.2 13.8 11.5 16 11.5V22" />
        </svg>
      );
    }
    if (type === 'cafe') {
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 8H16V15C16 17.2 14.2 19 12 19H8C5.8 19 4 17.2 4 15V8Z" />
          <path d="M16 10H17.5C18.9 10 20 11.1 20 12.5C20 13.9 18.9 15 17.5 15H16" />
          <line x1="7" y1="4" x2="7" y2="6.5" />
          <line x1="11" y1="4" x2="11" y2="6.5" />
        </svg>
      );
    }
    if (type === 'shopping') {
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 8H19L18 20C17.9 21.1 17 22 15.9 22H8.1C7 22 6.1 21.1 6 20L5 8Z" />
          <path d="M8 8V6C8 3.8 9.8 2 12 2C14.2 2 16 3.8 16 6V8" />
        </svg>
      );
    }
    // transport
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="3" width="14" height="13" rx="3" />
        <line x1="5" y1="10" x2="19" y2="10" />
        <circle cx="8.5" cy="19" r="1.6" />
        <circle cx="15.5" cy="19" r="1.6" />
        <line x1="7" y1="16" x2="7" y2="18" />
        <line x1="17" y1="16" x2="17" y2="18" />
      </svg>
    );
  };

  return (
    <HistoryMain id="history-screen">
      <ExpenseSummary aria-labelledby="expense-label">
        <ExpenseSummaryRow>
          <ExpenseLabel id="expense-label">이번 달 지출</ExpenseLabel>
          <MonthSelector ref={dropdownRef}>
            <MonthDropdownBtn
              $expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-controls="month-menu"
              type="button"
            >
              <span>{selectedMonth}월</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9L12 15L18 9" />
              </svg>
            </MonthDropdownBtn>
            {isDropdownOpen && (
              <MonthMenu id="month-menu" role="listbox" aria-label="조회할 월 선택">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <MonthOption
                    key={m}
                    role="option"
                    $isSelected={selectedMonth === m}
                    aria-selected={selectedMonth === m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setIsDropdownOpen(false);
                    }}
                    type="button"
                  >
                    {m}월
                  </MonthOption>
                ))}
              </MonthMenu>
            )}
          </MonthSelector>
        </ExpenseSummaryRow>
        <ExpenseAmount>
          <WonSign className="won-sign">₩</WonSign>
          {totalMonthlySpent.toLocaleString('ko-KR')}
        </ExpenseAmount>
      </ExpenseSummary>

      <CategoryFilters role="group" aria-label="소비 카테고리 필터">
        <FilterBtn
          $isActive={filterCategory === 'all'}
          onClick={() => setFilterCategory('all')}
          aria-pressed={filterCategory === 'all'}
          type="button"
        >
          전체
        </FilterBtn>
        <FilterBtn
          $isActive={filterCategory === 'food'}
          onClick={() => setFilterCategory('food')}
          aria-pressed={filterCategory === 'food'}
          type="button"
        >
          식비·카페
        </FilterBtn>
        <FilterBtn
          $isActive={filterCategory === 'shopping'}
          onClick={() => setFilterCategory('shopping')}
          aria-pressed={filterCategory === 'shopping'}
          type="button"
        >
          쇼핑
        </FilterBtn>
        <FilterBtn
          $isActive={filterCategory === 'transport'}
          onClick={() => setFilterCategory('transport')}
          aria-pressed={filterCategory === 'transport'}
          type="button"
        >
          교통비
        </FilterBtn>
      </CategoryFilters>

      <TransactionGroups>
        {groupedExpenses().map((group, idx) => (
          <DateGroupSection key={idx} $isPast={group.isPast} className={group.isPast ? 'date-group date-group--past' : 'date-group'}>
            <DateGroupHeader>
              <DateGroupTitle $isPast={group.isPast} className="date-group-title">
                {group.title}
              </DateGroupTitle>
              <DateGroupLine className="date-group-line" />
            </DateGroupHeader>
            <TransactionList className="transaction-list">
              {group.list.map((item) => {
                const iconType = getIconType(item.category, item.memo);
                return (
                  <TransactionCard
                    key={item.id}
                    $isPast={group.isPast}
                    className="transaction-card"
                  >
                    <TransactionIcon $type={iconType} className={`transaction-icon transaction-icon--${iconType}`}>
                      {renderIcon(iconType)}
                    </TransactionIcon>
                    <TransactionContent className="transaction-content">
                      <TransactionTitle className="transaction-title">{item.memo || item.categoryName}</TransactionTitle>
                      <TransactionDesc className="transaction-desc">{item.categoryName}</TransactionDesc>
                    </TransactionContent>
                    <TransactionAmountText className="transaction-amount">
                      ₩{item.amount.toLocaleString('ko-KR')}
                    </TransactionAmountText>
                  </TransactionCard>
                );
              })}
            </TransactionList>
          </DateGroupSection>
        ))}
      </TransactionGroups>

      <ProgressSummaryCard aria-label="이번 달 소비 진행률">
        <MascotWrap className="mascot-wrap">
          <img src={mongHappy} alt="기뻐하는 몽이" />
        </MascotWrap>
        <ProgressQuote className="progress-quote">
          “오늘도 알뜰하게 생활 중이에요!” <span className="quote-emoji">💛</span>
        </ProgressQuote>
        <ProgressTrack
          role="progressbar"
          aria-label="월 예산 사용률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={usagePercent}
          className="progress-track"
        >
          <ProgressFill $percent={usagePercent} className="progress-fill" />
        </ProgressTrack>
        <ProgressAmountText className="progress-amount-text">
          ₩{totalMonthlySpent.toLocaleString('ko-KR')} / ₩{totalBudget.toLocaleString('ko-KR')}
        </ProgressAmountText>
      </ProgressSummaryCard>

      <FabAdd
        id="fab-add"
        aria-label="지출 추가"
        onClick={() => navigate('/expense/write')}
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </FabAdd>
    </HistoryMain>
  );
};
export default ExpenseHistoryPage;
