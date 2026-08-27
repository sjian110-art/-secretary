import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { BottomNavigation } from '../components/BottomNavigation';
import mongReport from '../assets/mascot/mong_report.png';

const popIn = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const ExpenseContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px; /* 바텀네비 높이를 고려한 여백 */
  background-color: ${({ theme }) => theme.colors.cream};
  font-family: ${({ theme }) => theme.fonts.body};
  display: flex;
  flex-direction: column;
`;

const ExpenseMain = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[4]}`};

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const ExpenseCard = styled.section`
  position: relative;
  width: 100%;
  min-height: 820px;
  padding: 32px 32px 32px 52px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};

  @media (max-width: 390px) {
    padding-left: 44px;
    padding-right: ${({ theme }) => theme.spacing[3]};
  }
`;

const StepIndicator = styled.div`
  position: absolute;
  top: 108px;
  bottom: 140px;
  left: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 390px) {
    left: 14px;
  }
`;

const StepDot = styled.span<{ $isActive: boolean }>`
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.gray300};
  transition: background-color ${({ theme }) => theme.transition.default};
`;

const ExpenseForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const CardTitle = styled.h1`
  margin-bottom: 8px;
  color: #181800;
  font-family: ${({ theme }) => theme.fonts.title};
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
  color: #8C8A79;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const StepFieldset = styled.fieldset`
  min-width: 0;
  border: 0;
`;

const StepLegend = styled.legend`
  display: block;
  color: #8C8A79;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const AmountStep = styled(FormStep)`
  margin-bottom: 4px;
`;

const AmountInputWrap = styled.div`
  height: 76px;
  margin-top: 4px;
  display: flex;
  align-items: flex-end;
  border-bottom: 4px solid #C8D7C4; /* 옅은 올리브선 */
  transition: border-color ${({ theme }) => theme.transition.default};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AmountInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 60px;
  padding: 0 6px 2px;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  text-align: right;
  font-size: 44px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.body};

  &::placeholder {
    color: #E3DEC3;
  }

  @media (max-width: 390px) {
    font-size: 38px;
  }
`;

const CurrencyUnit = styled.span`
  padding: 0 0 8px 8px;
  color: #2B4C20;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 30px;
  flex-shrink: 0;
  font-weight: 700;
`;

const CategoryStep = styled(FormStep)`
  margin-bottom: 4px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 390px) {
    gap: 4px;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const CategoryBtn = styled.button<{ $isActive: boolean }>`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #FFFBE0; /* 시안 미선택 컬러 */
  color: #906212; /* 짙은 카키/브라운 아이콘 */
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};

  svg {
    width: 26px;
    height: 26px;
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
      box-shadow: 0 0 0 3px rgba(133, 174, 123, 0.4);
      transform: translateY(-2px);
    `}

  &:hover {
    background: #FFF59C;
    transform: translateY(-2px);
  }

  @media (max-width: 390px) {
    width: 46px;
    height: 46px;
  }
`;

const CategoryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 390px) {
    font-size: 12px;
  }
`;

const ImageStep = styled(FormStep)`
  margin-bottom: 4px;
`;

const ImageUploadBox = styled.div`
  width: 100%;
  aspect-ratio: 1.35;
  border: 2px dashed #B8C4B5;
  border-radius: 28px;
  background-color: #FFFBDC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.25s ease, background-color 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: #FFF9D0;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 26px;
`;

const UploadText = styled.span`
  color: #5C524B;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const MemoStep = styled(FormStep)`
  margin-bottom: 8px;
`;

const MemoInputWrap = styled.div`
  position: relative;
  height: 130px;
  margin-top: 8px;
  padding: 16px 20px;
  border-radius: 28px;
  background: #FFFBDC;
  box-shadow: ${({ theme }) => theme.shadow.inset};
`;

const MemoTextarea = styled.textarea`
  width: 100%;
  height: 72px;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: #5C524B;
  font-size: 17px;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.hand};

  &::placeholder {
    color: #A39E88;
  }
`;

const MemoDecorLine = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 24px;
  height: 2px;
  background: #E2DFCD;
  border-radius: 1px;
`;

const CharCounter = styled.span<{ $show: boolean }>`
  position: absolute;
  right: 20px;
  bottom: 6px;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 12px;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.transition.default};
`;

const SubmitAction = styled.div`
  margin-top: 12px;
`;

const BtnSubmit = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  path {
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
  }
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  aria-hidden: "true";
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isMemoFocused, setIsMemoFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // FileReader to convert file to Base64 String
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
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

    const selectedCategoryObj = categories.find((cat) => cat.id === category);
    const newExpense = {
      id: Date.now(),
      amount: Number(cleanAmount),
      category,
      categoryName: selectedCategoryObj?.name || '기타',
      memo: memo.trim(),
      image: imageSrc, // 이미지 파일의 base64 주소를 저장하여 다른 리스트나 디테일 뷰에서 활용할 수 있게 함!
      createdAt: new Date().toISOString(),
    };

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
    setAmount('');
    setCategory('');
    setMemo('');
    setImageSrc(null);
    navigate('/expense/history');
  };

  return (
    <ExpenseContainer id="expense-screen">
      <Header
        showBackButton={false} // 시안 디자인에 뒤로가기 버튼이 없음
        onRightClick={() => window.alert('새로운 알림이 없습니다.')}
      />
      <ExpenseMain>
        <ExpenseCard aria-labelledby="expense-title">
          <StepIndicator aria-hidden="true">
            <StepDot $isActive={!!amount} />
            <StepDot $isActive={!!category} />
            <StepDot $isActive={!!imageSrc} />
            <StepDot $isActive={!!memo} />
            <StepDot $isActive={false} />
          </StepIndicator>

          <ExpenseForm onSubmit={handleSubmit} noValidate>
            <CardTitle id="expense-title">오늘의 지출 기록</CardTitle>

            {/* Step 1: 얼마나 썼나요? */}
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

            {/* Step 2: 어디에 사용했나요? */}
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

            {/* Step 3: 이미지 추가하기 (신규 기능 분기) */}
            <ImageStep>
              <StepLabel>이미지 추가하기</StepLabel>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <ImageUploadBox onClick={handleBoxClick} role="button" tabIndex={0}>
                {imageSrc ? (
                  <ImagePreview src={imageSrc} alt="지출 증빙 미리보기" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="#7A7A7A" />
                      <polyline points="21 15 16 10 5 21" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <UploadText>
                      📎 이미지 추가하기
                    </UploadText>
                  </>
                )}
              </ImageUploadBox>
            </ImageStep>

            {/* Step 4: 오늘의 한줄 평 */}
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

            {/* Step 5: 기록하기 버튼 */}
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

      {/* 바텀 네비게이션 탑재 */}
      <BottomNavigation />
    </ExpenseContainer>
  );
};

export default ExpenseWritePage;
