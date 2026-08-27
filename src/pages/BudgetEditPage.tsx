import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { BottomNavigation } from '../components/BottomNavigation';
import mongReport from '../assets/mascot/mong_report.png';

const EditContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.cream};
  display: flex;
  flex-direction: column;
`;

const EditMain = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[4]}`};

  @media (max-width: 390px) {
    padding-inline: ${({ theme }) => theme.spacing[2]};
  }
`;

const IntroSection = styled.section`
  text-align: center;
  margin-bottom: 24px;
`;

const IntroTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.hand};
  color: #21160F;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.4;
`;



const IntroImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #FFFDF5;
  margin: 16px auto 0;
  border: 4px solid #FFFFFF;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionLabel = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  color: #2B4C20;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const TotalBudgetCard = styled.div`
  width: 100%;
  height: 72px;
  border-radius: 36px;
  background-color: #FFFDF5;
  border: 1px solid #ECE7D4;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
`;

const WalletIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #EAF5EA;
  color: #27823A;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const TotalBudgetInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 26px;
  font-weight: 800;
  color: #2F2F2F;
  background: transparent;

  &::placeholder {
    color: #C4C0B4;
  }
`;

const CurrencyText = styled.span`
  color: #8C8A79;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 16px;
  font-weight: 500;
`;

/* 한 달 생활 스탠스 */
const StanceGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const StanceBtn = styled.button<{ $isActive: boolean; $stance: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 17px;
  font-weight: 700;
  border: 1px solid #ECE7D4;
  background-color: #FFFDF5;
  color: #7A7A7A;
  transition: all 0.2s ease;

  ${({ $isActive, $stance }) => {
    if (!$isActive) return '';
    
    switch ($stance) {
      case '허리띠 졸라매기':
        return css`
          background-color: #FFEAEF;
          border-color: #EFDDEB;
          color: #7A3B4D;
          box-shadow: 0 2px 8px rgba(255, 234, 239, 0.6);
        `;
      case '바지 꽉 잠궈입기':
        return css`
          background-color: #FFF0E4;
          border-color: #EFDFDD;
          color: #7A4B3E;
          box-shadow: 0 2px 8px rgba(255, 240, 228, 0.6);
        `;
      case '평소처럼 유지':
        return css`
          background-color: #EBF4FF;
          border-color: #DDE9EF;
          color: #2A5A9F;
          box-shadow: 0 2px 8px rgba(235, 244, 255, 0.6);
        `;
      case '트레이닝 팬츠 입기':
        return css`
          background-color: #EAF5EA;
          border-color: #DDEFD5;
          color: #27823A;
          box-shadow: 0 2px 8px rgba(234, 245, 234, 0.6);
        `;
      case '여유롭게 즐기기':
        return css`
          background-color: #F3E8FF;
          border-color: #ECDDFE;
          color: #6A2ABF;
          box-shadow: 0 2px 8px rgba(243, 232, 255, 0.6);
        `;
      default:
        return '';
    }
  }}

  &:active {
    transform: scale(0.97);
  }
`;

/* 카테고리별 세부 조정 */
const CategoryDetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CategoryCard = styled.div`
  background-color: #FFFCEE; /* 옅은 노랑 카드 */
  border: 1px solid #FFF5D0;
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(255, 245, 208, 0.2);
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardIcon = styled.span<{ $bgColor: string; $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const CardLabel = styled.span`
  color: #21160F;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
`;

const RecommendedText = styled.span`
  color: #8C8A79;
  font-size: 13px;
  font-weight: 500;
`;

const BudgetInputWrap = styled.div`
  height: 48px;
  border-radius: 20px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.02);
`;

const BudgetInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 17px;
  font-weight: 700;
  color: #2F2F2F;
  text-align: right;
  background: transparent;

  &::placeholder {
    color: #C4C0B4;
  }
`;

const InputUnit = styled.span`
  color: #5C524B;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 17px;
  padding-left: 6px;
  font-weight: 700;
`;

/* 팁 카드 */
const TipCard = styled.div`
  background-color: #FFF9E3; /* 옅은 골드 팁 */
  border-radius: 20px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(255, 249, 227, 0.4);
`;

const TipIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFC000;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

const TipText = styled.p`
  color: #7D5B18;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 16px;
  line-height: 1.45;
  font-weight: 500;
`;

/* 제출 버튼 */
const SubmitBtn = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 28px;
  background-color: #0056C6; /* 시안 디자인 파란색 버튼 */
  color: #FFFFFF;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 86, 198, 0.25);
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #0046A3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const BudgetEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();

  // 예산 정보 로컬 상태
  const [totalBudget, setTotalBudget] = useState('1,200,000');
  const [activeStance, setActiveStance] = useState('허리띠 졸라매기');
  const [foodBudget, setFoodBudget] = useState('500,000');
  const [housingBudget, setHousingBudget] = useState('300,000');
  const [shoppingBudget, setShoppingBudget] = useState('200,000');

  // 로컬스토리지에서 기존 예산 정보 로드 및 헤더 상태 정의
  useEffect(() => {
    setHeaderConfig({
      showBackButton: true,
      title: (
        <span style={{ fontFamily: 'Jua', fontSize: '22px', color: '#2B4C20', fontWeight: 'bold' }}>
          월 예산 수정
        </span>
      ),
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });

    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
      setTotalBudget(Number(savedBudget).toLocaleString('ko-KR'));
    }

    const savedStance = localStorage.getItem('attitude');
    if (savedStance) {
      setActiveStance(savedStance);
    }

    const savedCategories = localStorage.getItem('budget_categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (parsed.food) setFoodBudget(Number(parsed.food).toLocaleString('ko-KR'));
        if (parsed.housing) setHousingBudget(Number(parsed.housing).toLocaleString('ko-KR'));
        if (parsed.shopping) setShoppingBudget(Number(parsed.shopping).toLocaleString('ko-KR'));
      } catch (e) {
        // 무시
      }
    }
  }, [setHeaderConfig]);

  const handleAmountChange = (val: string, setter: (v: string) => void) => {
    const rawValue = (val || '').replace(/[^\d]/g, '');
    setter(rawValue ? Number(rawValue).toLocaleString('ko-KR') : '');
  };

  const handleSave = () => {
    const cleanTotal = Number(String(totalBudget || '').replace(/[^\d]/g, ''));
    if (!cleanTotal || cleanTotal === 0) {
      window.alert('올바른 총 목표 예산을 입력해주세요.');
      return;
    }

    const cleanFood = Number(String(foodBudget || '').replace(/[^\d]/g, ''));
    const cleanHousing = Number(String(housingBudget || '').replace(/[^\d]/g, ''));
    const cleanShopping = Number(String(shoppingBudget || '').replace(/[^\d]/g, ''));

    // 로컬스토리지 저장
    localStorage.setItem('budget', String(cleanTotal));
    localStorage.setItem('attitude', activeStance);
    localStorage.setItem(
      'budget_categories',
      JSON.stringify({
        food: cleanFood,
        housing: cleanHousing,
        shopping: cleanShopping,
      })
    );

    navigate('/expense/plan');
  };

  const stances = [
    '허리띠 졸라매기',
    '바지 꽉 잠궈입기',
    '평소처럼 유지',
    '트레이닝 팬츠 입기',
    '여유롭게 즐기기',
  ];

  const stanceIcons: { [key: string]: string } = {
    '허리띠 졸라매기': '🐖',
    '바지 꽉 잠궈입기': '🔒',
    '평소처럼 유지': '😊',
    '트레이닝 팬츠 입기': '👖',
    '여유롭게 즐기기': '🎉',
  };

  return (
    <EditContainer id="budget-edit-screen">
      {/* Header를 직접 렌더링하지 않고 MainLayout의 공통 헤더 설정을 따름 */}
      <EditMain>
        <IntroSection>
          <IntroTitle>
            이번 달은 얼마나 아껴볼까요?
            <br />
            무리하지 않는 선에서 목표를 정해보세요.
          </IntroTitle>
          <IntroImageWrapper>
            <img src={mongReport} alt="안내하는 몽이" />
          </IntroImageWrapper>
        </IntroSection>

        <FormSection>
          {/* 총 목표 예산 */}
          <div>
            <SectionLabel>총 목표 예산</SectionLabel>
            <TotalBudgetCard>
              <WalletIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </WalletIcon>
              <TotalBudgetInput
                type="text"
                inputMode="numeric"
                value={totalBudget}
                onChange={(e) => handleAmountChange(e.target.value, setTotalBudget)}
                placeholder="0"
                maxLength={12}
              />
              <CurrencyText>KRW</CurrencyText>
            </TotalBudgetCard>
          </div>

          {/* 한 달 생활 스탠스 */}
          <div>
            <SectionLabel>한 달 생활 스탠스</SectionLabel>
            <StanceGrid>
              {stances.map((stance) => (
                <StanceBtn
                  key={stance}
                  type="button"
                  $stance={stance}
                  $isActive={activeStance === stance}
                  onClick={() => setActiveStance(stance)}
                >
                  <span>{stanceIcons[stance]}</span>
                  <span>{stance}</span>
                </StanceBtn>
              ))}
            </StanceGrid>
          </div>

          {/* 카테고리별 세부 조정 */}
          <div>
            <SectionLabel>카테고리별 세부 조정</SectionLabel>
            <CategoryDetailList>
              {/* 식비 */}
              <CategoryCard>
                <CardTop>
                  <CardLeft>
                    <CardIcon $bgColor="#FFEAEF" $color="#CC4B5C">
                      <svg viewBox="0 0 24 24">
                        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-8.03c2.09-.13 3.75-1.85 3.75-3.97V2v7h-2zM16 2v8h3v12h2V2h-5z" />
                      </svg>
                    </CardIcon>
                    <CardLabel>식비</CardLabel>
                  </CardLeft>
                  <RecommendedText>추천: 400,000</RecommendedText>
                </CardTop>
                <BudgetInputWrap>
                  <BudgetInput
                    type="text"
                    inputMode="numeric"
                    value={foodBudget}
                    onChange={(e) => handleAmountChange(e.target.value, setFoodBudget)}
                    placeholder="0"
                  />
                  <InputUnit>원</InputUnit>
                </BudgetInputWrap>
              </CategoryCard>

              {/* 주거/통신 */}
              <CategoryCard>
                <CardTop>
                  <CardLeft>
                    <CardIcon $bgColor="#EBF4FF" $color="#2A5A9F">
                      <svg viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </CardIcon>
                    <CardLabel>주거/통신</CardLabel>
                  </CardLeft>
                </CardTop>
                <BudgetInputWrap>
                  <BudgetInput
                    type="text"
                    inputMode="numeric"
                    value={housingBudget}
                    onChange={(e) => handleAmountChange(e.target.value, setHousingBudget)}
                    placeholder="0"
                  />
                  <InputUnit>원</InputUnit>
                </BudgetInputWrap>
              </CategoryCard>

              {/* 쇼핑/여가 */}
              <CategoryCard>
                <CardTop>
                  <CardLeft>
                    <CardIcon $bgColor="#FFEFEF" $color="#CC4B5C">
                      <svg viewBox="0 0 24 24">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.9-2-2-2zm-6 0h-4V4h4v2z" />
                      </svg>
                    </CardIcon>
                    <CardLabel>쇼핑/여가</CardLabel>
                  </CardLeft>
                </CardTop>
                <BudgetInputWrap>
                  <BudgetInput
                    type="text"
                    inputMode="numeric"
                    value={shoppingBudget}
                    onChange={(e) => handleAmountChange(e.target.value, setShoppingBudget)}
                    placeholder="0"
                  />
                  <InputUnit>원</InputUnit>
                </BudgetInputWrap>
              </CategoryCard>
            </CategoryDetailList>
          </div>

          {/* 하단 팁 카드 */}
          <TipCard>
            <TipIcon>
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </TipIcon>
            <TipText>
              예산을 수정해도 이전 기록은 사라지지 않으니 걱정 마세요!
            </TipText>
          </TipCard>

          {/* 완료 버튼 */}
          <SubmitBtn onClick={handleSave} type="button">
            수정 완료하기
          </SubmitBtn>
        </FormSection>
      </EditMain>

      <BottomNavigation />
    </EditContainer>
  );
};

export default BudgetEditPage;
