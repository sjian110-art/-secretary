import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Toast } from '../components/Toast';

import sofaImg from '../assets/images/sofa.png';
import deskImg from '../assets/images/desk.png';
import rugImg from '../assets/images/rug.png';

interface DecItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  isNew?: boolean;
}

const ITEMS: DecItem[] = [
  { id: 'sofa', name: '말랑 소파', cost: 300, image: sofaImg },
  { id: 'desk', name: '우드 책상', cost: 450, image: deskImg },
  { id: 'rug', name: '구름 러그', cost: 200, image: rugImg, isNew: true },
];

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #FFFAE3; /* theme.colors.cream */
  font-family: ${({ theme }) => theme.fonts.body};
  position: relative;
  overflow-x: hidden;
`;

const CustomHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  background-color: #FFFAE3;
  border-bottom: 1px solid rgba(222, 214, 187, 0.3);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1E4620;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transition.fast};

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const HeaderTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 18px;
  font-weight: 700;
  color: #1E4620;
  text-align: center;
  flex: 1;
  margin-right: 8px; /* Offset back button to center the title better */
`;

const SaveButton = styled.button`
  background-color: #FEF7DE;
  border: 1px solid #EFE7D3;
  color: #1E4620;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(222, 214, 187, 0.4);
  transition: background-color ${({ theme }) => theme.transition.fast}, transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: #FFF2C5;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RoomArea = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: linear-gradient(180deg, #FFF8F0 0%, #FFEFE3 100%);
  padding: 16px;
  position: relative;
`;

const RoomWrapper = styled.div`
  position: relative;
  width: 340px;
  height: 260px;
  margin: 0 auto;
`;

const PlacedItem = styled.img<{ $itemId: string }>`
  position: absolute;
  object-fit: contain;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;

  ${props =>
    props.$itemId === 'rug' &&
    css`
      left: 215px;
      top: 150px;
      width: 90px;
      height: auto;
      z-index: 10;
    `}

  ${props =>
    props.$itemId === 'desk' &&
    css`
      left: 145px;
      top: 75px;
      width: 100px;
      height: auto;
      z-index: 11;
    `}

  ${props =>
    props.$itemId === 'sofa' &&
    css`
      left: 55px;
      top: 110px;
      width: 90px;
      height: auto;
      z-index: 12;
    `}
`;

const HeartBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid #EFE7D3;
  border-radius: 9999px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  color: #C55858;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03);
  z-index: 20;
`;

const BottomPanel = styled.section`
  background-color: #DFD1C4;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
`;

const TabRow = styled.div`
  display: flex;
  background-color: #C8B7A6;
  border-radius: 16px;
  padding: 4px;
  gap: 4px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  text-align: center;
  padding: 10px 4px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  color: ${props => (props.$isActive ? '#8E523A' : '#6C5948')};
  background-color: ${props => (props.$isActive ? '#FEF7DE' : 'transparent')};
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
`;

const Card = styled.button<{ $isSelected: boolean }>`
  background-color: #FFFBDC;
  border-radius: 20px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  border: 3px solid ${props => (props.$isSelected ? '#85AE7B' : 'transparent')};
  transition: transform 0.15s, border-color 0.15s;
  outline: none;

  &:active {
    transform: scale(0.97);
  }
`;

const ThumbnailContainer = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 1px solid #EEEAE4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
`;

const ThumbnailImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const ItemName = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  color: #3A3A3A;
  margin-bottom: 4px;
  text-align: center;
`;

const ItemCost = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  color: #C55858;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const NewBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #D36A6A;
  color: #FFFFFF;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const LockedCard = styled.div`
  background-color: #DDD4C8;
  border-radius: 20px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
`;

const LockedThumbnail = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background-color: #EEEAE4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #9B948B;

  svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
`;

const LockedLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 700;
  color: #9B948B;
  margin-top: 4px;
  margin-bottom: 18px; /* Alignment with cost text space */
`;

const EmptyCategoryMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 154px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: #6C5948;
  text-align: center;
  width: 100%;
`;

export const RoomDecoratePage: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [totalHearts] = useState<number>(() => {
    const saved = localStorage.getItem('userHearts');
    return saved ? Number(saved) : 850;
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('furniture');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);

  // Load saved room decorating items on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('placedRoomItems');
    if (savedItems) {
      try {
        setSelectedItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Failed to parse placedRoomItems from localStorage', e);
      }
    }
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
  };

  // Hearts calculation
  const getSpentHearts = (items: string[]) => {
    return items.reduce((sum, id) => {
      const item = ITEMS.find(i => i.id === id);
      return sum + (item ? item.cost : 0);
    }, 0);
  };

  const spentHearts = getSpentHearts(selectedItems);
  const remainingHearts = totalHearts - spentHearts;

  const handleItemClick = (item: DecItem) => {
    const isAlreadySelected = selectedItems.includes(item.id);

    if (isAlreadySelected) {
      // Deselect and remove item
      const updated = selectedItems.filter(id => id !== item.id);
      setSelectedItems(updated);
    } else {
      // Check if user has enough hearts
      if (item.cost > remainingHearts) {
        triggerToast('하트가 부족하여 아이템을 적용할 수 없습니다.');
        return;
      }

      // Select and place item
      setSelectedItems(prev => [...prev, item.id]);
    }
  };

  const handleSave = () => {
    // Save selections
    localStorage.setItem('placedRoomItems', JSON.stringify(selectedItems));
    
    // Sync remaining hearts to localStorage so MyPage.tsx can read it
    const finalSpent = getSpentHearts(selectedItems);
    const finalHearts = totalHearts - finalSpent;
    localStorage.setItem('userHearts', finalHearts.toString());

    triggerToast('방 꾸미기 배치가 저장되었습니다.');
  };

  return (
    <PageContainer>
      <CustomHeader>
        <BackButton onClick={() => navigate('/mypage')} aria-label="마이페이지로 이동">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </BackButton>
        <HeaderTitle>방 꾸미기</HeaderTitle>
        <SaveButton onClick={handleSave}>저장</SaveButton>
      </CustomHeader>

      <RoomArea>
        <HeartBadge aria-label={`보유 하트 ${remainingHearts}개`}>
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 11.5C7 11.5 1.5 8 1.5 4.5C1.5 2.84 2.84 1.5 4.5 1.5C5.5 1.5 6.38 2.01 7 2.76C7.62 2.01 8.5 1.5 9.5 1.5C11.16 1.5 12.5 2.84 12.5 4.5C12.5 8 7 11.5 7 11.5Z"
              fill="#C55858"
              stroke="#C55858"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{remainingHearts}</span>
        </HeartBadge>

        <RoomWrapper>
          <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            {/* Left Wall */}
            <path d="M40 80 L170 30 L170 120 L40 170 Z" fill="#E5DFCD" stroke="#C2B690" strokeWidth="1.5" />

            {/* Right Wall */}
            <path d="M170 30 L300 80 L300 170 L170 120 Z" fill="#EDE7D3" stroke="#C2B690" strokeWidth="1.5" />

            {/* Floor */}
            <path d="M40 170 L170 120 L300 170 L170 220 Z" fill="#E2DCBD" stroke="#C2B690" strokeWidth="1.5" />

            {/* Floor Grid Lines */}
            {/* Direction A (parallel to left-to-center corner) */}
            <line x1="202.5" y1="207.5" x2="72.5" y2="157.5" stroke="#D6CEAC" strokeWidth="1.2" />
            <line x1="235" y1="195" x2="105" y2="145" stroke="#D6CEAC" strokeWidth="1.2" />
            <line x1="267.5" y1="182.5" x2="137.5" y2="132.5" stroke="#D6CEAC" strokeWidth="1.2" />

            {/* Direction B (parallel to right-to-center corner) */}
            <line x1="137.5" y1="207.5" x2="267.5" y2="157.5" stroke="#D6CEAC" strokeWidth="1.2" />
            <line x1="105" y1="195" x2="235" y2="145" stroke="#D6CEAC" strokeWidth="1.2" />
            <line x1="72.5" y1="182.5" x2="202.5" y2="132.5" stroke="#D6CEAC" strokeWidth="1.2" />

            {/* Oval disc at the bottom-right floor corner */}
            <ellipse cx="260" cy="180" rx="18" ry="9" fill="#F4EED8" stroke="#E3DBBF" strokeWidth="1.5" />
          </svg>

          {/* Placed Furniture Items */}
          {selectedItems.includes('rug') && (
            <PlacedItem src={rugImg} $itemId="rug" alt="구름 러그 배치됨" />
          )}
          {selectedItems.includes('desk') && (
            <PlacedItem src={deskImg} $itemId="desk" alt="우드 책상 배치됨" />
          )}
          {selectedItems.includes('sofa') && (
            <PlacedItem src={sofaImg} $itemId="sofa" alt="말랑 소파 배치됨" />
          )}
        </RoomWrapper>
      </RoomArea>

      <BottomPanel>
        <TabRow role="tablist" aria-label="방 꾸미기 카테고리">
          <TabButton
            role="tab"
            aria-selected={activeTab === 'furniture'}
            $isActive={activeTab === 'furniture'}
            onClick={() => setActiveTab('furniture')}
          >
            가구/소품
          </TabButton>
          <TabButton
            role="tab"
            aria-selected={activeTab === 'wallpaper'}
            $isActive={activeTab === 'wallpaper'}
            onClick={() => setActiveTab('wallpaper')}
          >
            벽지/바닥
          </TabButton>
          <TabButton
            role="tab"
            aria-selected={activeTab === 'pet'}
            $isActive={activeTab === 'pet'}
            onClick={() => setActiveTab('pet')}
          >
            펫/식물
          </TabButton>
          <TabButton
            role="tab"
            aria-selected={activeTab === 'fabric'}
            $isActive={activeTab === 'fabric'}
            onClick={() => setActiveTab('fabric')}
          >
            패브릭
          </TabButton>
        </TabRow>

        {activeTab === 'furniture' ? (
          <ItemsGrid>
            {/* Active Items */}
            {ITEMS.map(item => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <Card
                  key={item.id}
                  type="button"
                  $isSelected={isSelected}
                  onClick={() => handleItemClick(item)}
                  aria-label={`${item.name}, 필요한 하트 ${item.cost}개. ${
                    isSelected ? '선택 해제하려면 누르세요.' : '배치하려면 누르세요.'
                  }`}
                >
                  {item.isNew && <NewBadge>NEW</NewBadge>}
                  <ThumbnailContainer>
                    <ThumbnailImg src={item.image} alt={item.name} />
                  </ThumbnailContainer>
                  <ItemName>{item.name}</ItemName>
                  <ItemCost>
                    <span>{item.cost}</span>
                    <svg width="11" height="10" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7 11.5C7 11.5 1.5 8 1.5 4.5C1.5 2.84 2.84 1.5 4.5 1.5C5.5 1.5 6.38 2.01 7 2.76C7.62 2.01 8.5 1.5 9.5 1.5C11.16 1.5 12.5 2.84 12.5 4.5C12.5 8 7 11.5 7 11.5Z"
                        fill="#C55858"
                        stroke="#C55858"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ItemCost>
                </Card>
              );
            })}

            {/* Locked Items */}
            <LockedCard aria-label="잠겨 있는 가구 슬롯 1">
              <LockedThumbnail>
                <svg viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </LockedThumbnail>
              <LockedLabel>LOCKED</LockedLabel>
            </LockedCard>

            <LockedCard aria-label="잠겨 있는 가구 슬롯 2">
              <LockedThumbnail>
                <svg viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </LockedThumbnail>
              <LockedLabel>LOCKED</LockedLabel>
            </LockedCard>

            <LockedCard aria-label="잠겨 있는 가구 슬롯 3">
              <LockedThumbnail>
                <svg viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </LockedThumbnail>
              <LockedLabel>LOCKED</LockedLabel>
            </LockedCard>
          </ItemsGrid>
        ) : (
          <EmptyCategoryMessage aria-live="polite">
            이 카테고리에는 아직 활성화된 상품이 없습니다.
          </EmptyCategoryMessage>
        )}
      </BottomPanel>

      <Toast isOpen={isToastOpen} message={toastMessage} onClose={() => setIsToastOpen(false)} />
    </PageContainer>
  );
};

export default RoomDecoratePage;
