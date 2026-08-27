import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';

// 에셋 임포트 (기존 에셋 활용)
import iconGuide from '../assets/icons/Home_Vector4.png';    // 이용방법 (영수증/문서 모양)
import iconAccount from '../assets/icons/Home_Vector8.png';  // 계정/인증 (사람 프로필 모양)
import iconBudget from '../assets/icons/Home_Vector6.png';   // 예산관리 (돼지 저금통 모양)
import iconChallenge from '../assets/icons/Home_Vector1.png';// 챌린지 (불꽃/트로피 모양)
import mongShy from '../assets/mascot/mong_shy.png';         // 수줍은 몽이 캐릭터

const CustomerContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 120px; /* 바텀 네비게이션 여백 확보 */
  background-color: ${({ theme }) => theme.colors.cream};
  font-family: ${({ theme }) => theme.fonts.body};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const ContentMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 20px 24px;
`;

/* 검색 바 영역 */
const SearchBox = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 28px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  background-color: #F0EAD8; /* 시안 톤의 옅은 크림 베이지색 */
  border: 0;
  border-radius: 24px;
  padding: 0 20px 0 46px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  color: #21160F;
  outline: none;

  &::placeholder {
    color: #A39B8C;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A39B8C;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #21160F;
  margin: 0 0 16px 0;
  text-align: left;
`;

/* 카테고리 그리드 */
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 32px;
`;

const CategoryCard = styled.button`
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;

  &:active {
    transform: scale(0.95);
  }
`;

const IconBubble = styled.div<{ $bgColor: string }>`
  width: 58px;
  height: 58px;
  border-radius: 20px;
  background-color: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const CategoryName = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #4E3F30;
`;

/* FAQ 아코디언 스타일 */
const SubTitle = styled.h3`
  font-size: 13px;
  font-weight: bold;
  color: #8C8A79;
  margin: 0 0 12px 0;
  text-align: left;
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;
`;

const AccordionItem = styled.div`
  background-color: #FFFDF4;
  border-radius: 20px;
  border: 1px solid #ECE7D4;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(236, 231, 212, 0.25);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #DDD8C4;
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 18px 20px;
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
  gap: 12px;
`;

const AccordionTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #21160F;
`;

const AccordionArrow = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: #8C8A79;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AccordionBody = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '200px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  background-color: #FFFDFB;
  border-top: ${({ $isOpen }) => ($isOpen ? '1px solid #ECE7D4' : 'none')};
`;

const AccordionContent = styled.div`
  padding: 16px 20px;
  font-size: 13px;
  line-height: 1.6;
  color: #5C4F43;
  text-align: left;
  white-space: pre-line;
`;

/* 하단 문의 카드 */
const InquiryCard = styled.div`
  background-color: #FFFEE0; /* 시안 속 연노랑 카드 */
  border-radius: 28px;
  border: 1.5px solid #EFECAF;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(239, 236, 175, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const InquiryMascot = styled.img`
  width: 90px;
  height: auto;
  margin-bottom: 12px;
  object-fit: contain;
`;

const InquiryTitle = styled.h4`
  font-size: 20px;
  font-weight: bold;
  color: #21160F;
  margin: 0 0 8px 0;
  font-family: 'Jua', sans-serif;
`;

const InquiryDesc = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #5C524B;
  margin: 0 0 20px 0;
  white-space: pre-line;
`;

const InquiryButton = styled.button`
  width: 100%;
  max-width: 280px;
  height: 48px;
  background-color: #87AB81; /* 시안 초록 버튼색 */
  color: #FFFFFF;
  font-size: 15px;
  font-weight: bold;
  border: 0;
  border-radius: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.15s ease, background-color 0.2s ease;

  &:active {
    transform: scale(0.97);
  }

  &:hover {
    background-color: #72966B;
  }
`;

export const CustomerServicePage: React.FC = () => {
  const { setHeaderConfig } = useHeader();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    setHeaderConfig({
      showBackButton: true,
      title: '고객센터',
      showNotification: false,
    });
  }, [setHeaderConfig]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleInquiryClick = () => {
    window.alert('준비 중입니다.');
  };

  const faqItems = [
    {
      question: '비서 성격은 어떻게 바꾸나요?',
      answer: '마이페이지 > 나의 비서 설정 메뉴에서 몽이의 성격(포근함, 차가움, 수줍음 등)을 언제든지 변경하실 수 있습니다.\n성격에 따라 비서의 대화 말투와 소비 리포트 어조가 달라져요!',
    },
    {
      question: '목표 예산은 언제 수정할 수 있나요?',
      answer: '목표 예산은 매월 시작 시점 또는 [계획] 탭 우측 상단의 [예산 수정] 메뉴를 통해 원하실 때 실시간으로 변경하실 수 있습니다.\n예산을 조절하면 몽이가 새로운 지출 조언을 건네줍니다.',
    },
    {
      question: '지출 내역을 삭제하고 싶어요.',
      answer: '[지출] 탭 > 지출 내역 확인 페이지에서 개별 지출 카드 우측의 휴지통 아이콘을 누르면 내역이 즉각 삭제됩니다.\n한 번 삭제된 지출 내역은 복구가 불가능하니 신중히 선택해 주세요.',
    },
  ];

  return (
    <CustomerContainer>
      <ContentMain>
        {/* 1. 검색창 */}
        <SearchBox>
          <SearchIcon aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="궁금한 점을 검색해 보세요."
            aria-label="궁금한 점 검색"
          />
        </SearchBox>

        {/* 2. 자주 묻는 질문 카테고리 */}
        <SectionTitle>자주 묻는 질문</SectionTitle>
        <CategoryGrid aria-label="질문 카테고리">
          <CategoryCard type="button" onClick={() => window.alert('이용방법 FAQ 준비 중입니다.')}>
            <IconBubble $bgColor="#DCE7F4">
              <img src={iconGuide} alt="" />
            </IconBubble>
            <CategoryName>이용방법</CategoryName>
          </CategoryCard>

          <CategoryCard type="button" onClick={() => window.alert('계정/인증 FAQ 준비 중입니다.')}>
            <IconBubble $bgColor="#FFEED5">
              <img src={iconAccount} alt="" />
            </IconBubble>
            <CategoryName>계정/인증</CategoryName>
          </CategoryCard>

          <CategoryCard type="button" onClick={() => window.alert('예산관리 FAQ 준비 중입니다.')}>
            <IconBubble $bgColor="#FBD9E2">
              <img src={iconBudget} alt="" />
            </IconBubble>
            <CategoryName>예산관리</CategoryName>
          </CategoryCard>

          <CategoryCard type="button" onClick={() => window.alert('챌린지 FAQ 준비 중입니다.')}>
            <IconBubble $bgColor="#EFEBC9">
              <img src={iconChallenge} alt="" />
            </IconBubble>
            <CategoryName>챌린지</CategoryName>
          </CategoryCard>
        </CategoryGrid>

        {/* 3. FAQ 리스트 */}
        <SubTitle>가장 많이 찾는 질문</SubTitle>
        <AccordionList aria-label="자주 찾는 질문 리스트">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <AccordionItem key={index}>
                <AccordionHeader
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  type="button"
                >
                  <AccordionTitle>{item.question}</AccordionTitle>
                  <AccordionArrow $isOpen={isOpen} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </AccordionArrow>
                </AccordionHeader>
                <AccordionBody $isOpen={isOpen}>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </AccordionList>

        {/* 4. 문의 카드 */}
        <InquiryCard>
          <InquiryMascot src={mongShy} alt="수줍은 몽이" />
          <InquiryTitle>직접 문의를 남기고 싶으신가요?</InquiryTitle>
          <InquiryDesc>
            {`문의하신 내용은 확인 후 영업일 기준\n1~3일 내로 답변 드릴게요.`}
          </InquiryDesc>
          <InquiryButton onClick={handleInquiryClick} type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginTop: '2px' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>1:1 문의하기</span>
          </InquiryButton>
        </InquiryCard>
      </ContentMain>
    </CustomerContainer>
  );
};

export default CustomerServicePage;
