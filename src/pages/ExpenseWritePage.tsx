import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import mongReport from '../assets/mascot/mong_report.png';

const popIn = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const ExpenseContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.cream};
  font-family: ${({ theme }) => theme.fonts.serif};
`;

const ExpenseMain = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[6]}`};

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const ExpenseCard = styled.section`
  position: relative;
  width: 100%;
  min-height: 720px;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[4]} 52px`};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};

  @media (max-width: 390px) {
    padding-left: 44px;
    padding-right: ${({ theme }) => theme.spacing[3]};
  }
`;

const StepIndicator = styled.div`
  position: absolute;
  top: 105px;
  bottom: 72px;
  left: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const StepDot = styled.span<{ $isActive: boolean }>`
  display: block;
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.gray300};
  transition: background-color ${({ theme }) => theme.transition.default};
`;

const ExpenseForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: #181800;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;

  @media (max-width: 390px) {
    font-size: 24px;
  }
`;

const FormStep = styled.div`
  min-width: 0;
  border: 0;
`;

const StepLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  font-weight: 500;
`;

const StepFieldset = styled.fieldset`
  min-width: 0;
  border: 0;
`;

const StepLegend = styled.legend`
  display: block;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  font-weight: 500;
`;

const AmountStep = styled(FormStep)`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const AmountInputWrap = styled.div`
  height: 90px;
  margin: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]} 0 ${theme.spacing[1]}`};
  display: flex;
  align-items: flex-end;
  border-bottom: 4px solid ${({ theme }) => theme.colors.primaryBg};
  transition: border-color ${({ theme }) => theme.transition.default};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AmountInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 64px;
  padding: 0 6px 2px;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  text-align: right;
  font-size: 46px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.serif};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray300};
  }

  @media (max-width: 390px) {
    font-size: 40px;
  }
`;

const CurrencyUnit = styled.span`
  padding: 0 0 6px 8px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 34px;
  flex-shrink: 0;
`;

const CategoryStep = styled(FormStep)`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: ${({ theme }) => theme.spacing[3]};
  transform: translateX(-8px);

  @media (max-width: 390px) {
    gap: 6px;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const CategoryBtn = styled.button<{ $isActive: boolean }>`
  width: 58px;
  height: 58px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: grid;
  place-items: center;
  background: #FFF9D9; /* pale yellow */
  color: #936000;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};

  svg {
    width: 28px;
    height: 28px;
  }

  svg * {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linejoin: round;
  }

  svg > path:first-child:last-child {
    fill: currentColor;
    stroke: none;
  }

  .etc-mark {
    fill: currentColor;
    stroke: none;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      background: #FFF59C !important;
      box-shadow: 0 0 0 3px rgba(133, 174, 123, 0.35);
      transform: translateY(-3px);
    `}

  &:hover {
    background: #FFF59C;
    transform: translateY(-3px);
  }

  @media (max-width: 390px) {
    width: 50px;
    height: 50px;
  }
`;

const CategoryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  white-space: nowrap;

  @media (max-width: 390px) {
    font-size: 12px;
  }
`;

const MemoStep = styled(FormStep)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const MemoInputWrap = styled.div`
  position: relative;
  height: 160px;
  margin: ${({ theme }) => theme.spacing[2]} 0 0 -8px;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.radius.cardLg};
  background: #FFFBDC;
  box-shadow: ${({ theme }) => theme.shadow.inset};
`;

const MemoTextarea = styled.textarea`
  width: 100%;
  height: 76px;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  line-height: 1.55;
  font-family: ${({ theme }) => theme.fonts.serif};

  &::placeholder {
    color: #9A9A8E;
  }
`;

const MemoDecorLine = styled.div`
  position: absolute;
  left: 19px;
  right: 19px;
  bottom: ${({ theme }) => theme.spacing[3]};
  height: 3px;
  background: ${({ theme }) => theme.colors.gray300};
  border-radius: 2px;
`;

const CharCounter = styled.span<{ $show: boolean }>`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  bottom: 6px;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 12px;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.transition.default};
`;

const SubmitAction = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[2]};
`;

const BtnSubmit = styled.button`
  width: 100%;
  height: ${({ theme }) => theme.size.btnHeight};
  border-radius: ${({ theme }) => theme.radius.btn};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 0 ${({ theme }) => theme.colors.primaryDeep};
  color: ${({ theme }) => theme.colors.textWhite};
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 24px;
  letter-spacing: 1px;
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
    background-color: #78A06E;
  }
`;

const PencilIcon = styled.span`
  width: ${({ theme }) => theme.icon.md};
  height: ${({ theme }) => theme.icon.md};
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  path {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }
`;

/* Success Bubble popup inside Modal */
const ModalContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  animation: ${popIn} 0.28s ease-out;
`;

const ModalMascot = styled.img`
  width: 62px;
  height: 70px;
  flex: 0 0 62px;
  object-fit: contain;
`;

const ModalBubble = styled.button`
  position: relative;
  width: 340px;
  min-height: 80px;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => `${theme.radius.input} ${theme.radius.cardLg} ${theme.radius.cardLg}`};
  background: #FFF29A;
  color: #784D09;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 18px;
  line-height: 1.5;
  box-shadow: ${({ theme }) => theme.shadow.default};

  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 0;
    border-top: 16px solid #FFF29A;
    border-left: 16px solid transparent;
  }

  @media (max-width: 390px) {
    font-size: 16px;
  }
`;

export const ExpenseWritePage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [isMemoFocused, setIsMemoFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const amountInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    {
      id: 'food',
      name: '식비',
      svg: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v7a4 4 0 003 3.87V21a1 1 0 102 0v-7.13A4 4 0 0015 10V3a1 1 0 00-2 0v5h-1V3a1 1 0 00-2 0v5H9V3a1 1 0 00-2 0zm11 0a1 1 0 00-1 1v6a3 3 0 003 3h1v8a1 1 0 102 0V4a1 1 0 00-1-1h-4z" />
        </svg>
      ),
    },
    {
      id: 'life',
      name: '생활',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 10v9a2 2 0 01-2 2H7a2 2 0 01-2-2v-9a1 1 0 01.3-.7l6-6a1 1 0 011.4 0l6 6a1 1 0 01.3.7z" />
          <rect x="10" y="14" width="4" height="7" />
        </svg>
      ),
    },
    {
      id: 'transport',
      name: '교통',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="3" width="14" height="13" rx="3" />
          <line x1="5" y1="10" x2="19" y2="10" />
          <circle cx="8.5" cy="19" r="1.5" />
          <circle cx="15.5" cy="19" r="1.5" />
          <line x1="7" y1="16" x2="7" y2="18" />
          <line x1="17" y1="16" x2="17" y2="18" />
        </svg>
      ),
    },
    {
      id: 'culture',
      name: '문화',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="7" rx="7" ry="3" />
          <path d="M5 7v4c0 1.66 3.13 3 7 3s7-1.34 7-3V7" />
          <path d="M5 11v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" />
        </svg>
      ),
    },
    {
      id: 'etc',
      name: '기타',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <rect className="etc-mark" x="6" y="14" width="4" height="2" />
        </svg>
      ),
    },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setAmount(rawValue ? Number(rawValue).toLocaleString('ko-KR') : '');
  };

  const handleAmountPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteText = e.clipboardData.getData('text');
    if (/[^\d]/.test(pasteText)) {
      e.preventDefault();
    }
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setMemo(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = amount.replace(/[^\d]/g, '');

    if (!cleanAmount || Number(cleanAmount) === 0) {
      window.alert('지출 금액을 입력해주세요!');
      amountInputRef.current?.focus();
      return;
    }

    if (!category) {
      window.alert('사용하신 카테고리를 선택해주세요!');
      return;
    }

    // Save mock expense object
    const selectedCategoryObj = categories.find((cat) => cat.id === category);
    const newExpense = {
      id: Date.now(),
      amount: Number(cleanAmount),
      category,
      categoryName: selectedCategoryObj?.name || '기타',
      memo: memo.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save in localStorage as standard array (for HistoryPage binding)
    const existingStr = localStorage.getItem('expenses') || '[]';
    let existingList = [];
    try {
      existingList = JSON.parse(existingStr);
    } catch {
      existingList = [];
    }
    existingList.unshift(newExpense);
    localStorage.setItem('expenses', JSON.stringify(existingList));
    localStorage.setItem('latestExpense', JSON.stringify(newExpense));

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form fields
    setAmount('');
    setCategory('');
    setMemo('');
    // Route to history
    navigate('/expense/history');
  };

  return (
    <ExpenseContainer id="expense-screen">
      <Header
        showBackButton={true}
        onRightClick={() => window.alert('새로운 알림이 없습니다.')}
      />
      <ExpenseMain>
        <ExpenseCard aria-labelledby="expense-title">
          <StepIndicator aria-hidden="true">
            <StepDot $isActive={!!amount} />
            <StepDot $isActive={!!category} />
            <StepDot $isActive={!!memo} />
            <StepDot $isActive={false} />
            <StepDot $isActive={false} />
          </StepIndicator>

          <ExpenseForm onSubmit={handleSubmit} noValidate>
            <CardTitle id="expense-title">오늘의 지출 기록</CardTitle>

            <AmountStep id="step-amount">
              <StepLabel htmlFor="amount-input">얼마나 썼나요?</StepLabel>
              <AmountInputWrap>
                <AmountInput
                  ref={amountInputRef}
                  type="text"
                  inputMode="numeric"
                  id="amount-input"
                  placeholder="0"
                  maxLength={11}
                  autoComplete="off"
                  value={amount}
                  onChange={handleAmountChange}
                  onPaste={handleAmountPaste}
                />
                <CurrencyUnit>원</CurrencyUnit>
              </AmountInputWrap>
            </AmountStep>

            <CategoryStep>
              <StepFieldset id="step-category">
                <StepLegend>어디에 사용했나요?</StepLegend>
                <CategoryGrid>
                  {categories.map((cat) => (
                    <CategoryItem key={cat.id}>
                      <CategoryBtn
                        type="button"
                        $isActive={category === cat.id}
                        onClick={() => setCategory(cat.id)}
                        aria-label={`${cat.name} 선택`}
                        aria-pressed={category === cat.id}
                      >
                        {cat.svg}
                      </CategoryBtn>
                      <CategoryLabel>{cat.name}</CategoryLabel>
                    </CategoryItem>
                  ))}
                </CategoryGrid>
              </StepFieldset>
            </CategoryStep>

            <MemoStep id="step-memo">
              <StepLabel htmlFor="memo-input">오늘의 한줄 평</StepLabel>
              <MemoInputWrap>
                <MemoTextarea
                  id="memo-input"
                  placeholder="오늘 하루를 기록해주세요..."
                  maxLength={100}
                  value={memo}
                  onChange={handleMemoChange}
                  onFocus={() => setIsMemoFocused(true)}
                  onBlur={() => setIsMemoFocused(false)}
                />
                <MemoDecorLine />
                <CharCounter $show={isMemoFocused || memo.length > 0}>
                  {memo.length} / 100
                </CharCounter>
              </MemoInputWrap>
            </MemoStep>

            <SubmitAction>
              <BtnSubmit type="submit" id="btn-submit">
                <span>기록하기</span>
                <PencilIcon className="pencil-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M18.41 5.8L17.2 4.59c-.78-.78-2.05-.78-2.83 0l-9 9c-.27.27-.45.61-.51.98l-.8 4.8c-.08.49.34.91.83.83l4.8-.8c.37-.06.71-.24.98-.51l9-9c.78-.78.78-2.05 0-2.83zM14 6.7l2.3 2.3M5.5 17.5l1-1M16.5 7.5L14.2 5.2" />
                  </svg>
                </PencilIcon>
              </BtnSubmit>
            </SubmitAction>
          </ExpenseForm>
        </ExpenseCard>
      </ExpenseMain>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <ModalMascot src={mongReport} alt="안내하는 몽이" />
          <ModalBubble onClick={handleCloseModal} type="button">
            “오늘의 지출을 기록하면, 제가 예쁜 정원으로
            <br />
            가꿔드릴게요! 당신의 하루는 어땠나요?”
          </ModalBubble>
        </ModalContent>
      </Modal>
    </ExpenseContainer>
  );
};
export default ExpenseWritePage;
