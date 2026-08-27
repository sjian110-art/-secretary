import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import { BottomNavigation } from '../components/BottomNavigation';

// 에셋 임포트
import roofImg from '../assets/icons/Home Screen_roof.png';
import vec1 from '../assets/icons/Home_Vector1.png';
import vec2 from '../assets/icons/Home_Vector2.png';
import vec3 from '../assets/icons/Home_Vector3.png';
import vec4 from '../assets/icons/Home_Vector4.png';
import vec5 from '../assets/icons/Home_Vector5.png';
import vec6 from '../assets/icons/Home_Vector6.png';
import vec7 from '../assets/icons/Home_Vector7.png';
import vec8 from '../assets/icons/Home_Vector8.png';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 120px; /* Safe Area 고려하여 하단 여백 확보 */
  background-color: ${({ theme }) => theme.colors.cream};
  display: flex;
  flex-direction: column;
`;

const HomeMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

/* 집 지붕 그래픽 영역 */
const RoofGraphic = styled.div`
  width: 100%;
  margin-top: 0;
  margin-bottom: -15px; /* 카드 그리드와 겹치게 배치 */
  overflow: visible;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

/* 2열 x 4행 카드 그리드 */
const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 20px 24px;
`;

/* 1. 버튼(Container) 컴포넌트 - 순수 CSS 구현 */
const HomeCard = styled.button<{ $bgColor: string; $shadowColor: string }>`
  position: relative;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 28px;
  border: 0;
  width: 100%;
  aspect-ratio: 202 / 160;
  
  /* 4. 버튼 내부는 Column(Flex) 레이아웃 구성 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 5. justify-content: space-between 사용하여 버튼 안 배치 보장 */
  justify-content: space-between;
  
  box-sizing: border-box;
  
  /* 3. 버튼 내부에 충분한 상하좌우 패딩 적용 (하단 여백 약 16~20px 고려해 18px 지정) */
  padding: 20px 14px 18px;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  
  /* 부드러운 그림자 (베이스 섀도우 + 컬러 매칭 글로우 섀도우) */
  box-shadow: 0 8px 24px rgba(33, 22, 15, 0.04), 0 4px 12px ${({ $shadowColor }) => $shadowColor};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(33, 22, 15, 0.06), 0 6px 16px ${({ $shadowColor }) => $shadowColor};
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 12px rgba(33, 22, 15, 0.04), 0 2px 6px ${({ $shadowColor }) => $shadowColor};
  }
`;

const CardTitle = styled.span`
  font-family: 'Jua', sans-serif;
  /* 7. overflow 방지를 위해 버튼 높이에 맞춰 폰트 크기 자동 조절 */
  font-size: clamp(12px, 3.8vw, 15px);
  font-weight: bold;
  color: #21160F;
  line-height: 1.15;
  word-break: keep-all;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1; /* 가용 공간 안에서 균형있게 정렬 */
  margin-bottom: 6px;
`;

const CardIcon = styled.img`
  width: auto;
  /* 7. overflow 방지를 위해 버튼 높이에 맞춰 아이콘 크기를 비율로 조정 */
  /* 6. absolute 배치 대신 일반 레이아웃 흐름 내 배치 */
  height: 24%;
  max-width: 80%;
  object-fit: contain;
  display: block;
  margin-top: auto;
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: undefined,
      onRightClick: () => {
        window.alert('새로운 알림이 없습니다.');
      },
    });
  }, [setHeaderConfig]);

  // 카드 리스트 및 라우트 정보 정의 (순서: 왼쪽 1->오른쪽 1->왼쪽 2->오른쪽 2->...)
  const cards = [
    {
      id: 'challenge',
      title: '챌린지 하러가기',
      bgColor: '#FFF0F5', /* 옅은 핑크/보라 */
      shadowColor: 'rgba(219, 112, 147, 0.15)',
      vectorIcon: vec1,
      route: '/challenge',
    },
    {
      id: 'chat',
      title: '몽이에게 말 걸기',
      bgColor: '#FF6065', /* 다홍색 */
      shadowColor: 'rgba(255, 96, 101, 0.3)',
      vectorIcon: vec2,
      route: '',
    },
    {
      id: 'plan',
      title: '계획 짜러가기',
      bgColor: '#FFBF75', /* 살구 오렌지 */
      shadowColor: 'rgba(255, 191, 117, 0.35)',
      vectorIcon: vec3,
      route: '/expense/plan',
    },
    {
      id: 'history',
      title: '지출내역 확인하기',
      bgColor: '#A6F4C5', /* 민트 연두 */
      shadowColor: 'rgba(166, 244, 197, 0.45)',
      vectorIcon: vec4,
      route: '/expense/history',
    },
    {
      id: 'write',
      title: '오늘 기록하기',
      bgColor: '#8EB8FF', /* 밝은 하늘 */
      shadowColor: 'rgba(142, 184, 255, 0.35)',
      vectorIcon: vec5,
      route: '/expense/write',
    },
    {
      id: 'statistics',
      title: '예산 통계 보기',
      bgColor: '#FCF972', /* 노란색 */
      shadowColor: 'rgba(252, 249, 114, 0.45)',
      vectorIcon: vec6,
      route: '/statistics',
    },
    {
      id: 'dailyLog',
      title: '데일리로그 보기',
      bgColor: '#E2B3FF', /* 연보라 */
      shadowColor: 'rgba(226, 179, 255, 0.35)',
      vectorIcon: vec7,
      route: '/daily-log',
    },
    {
      id: 'mypage',
      title: '마이페이지 입장',
      bgColor: '#FFA170', /* 산호 코랄 */
      shadowColor: 'rgba(255, 161, 112, 0.35)',
      vectorIcon: vec8,
      route: '/mypage',
    },
  ];

  const handleCardClick = (route: string, title: string) => {
    if (!route) {
      window.alert(`"${title}" 기능은 준비 중입니다.`);
      return;
    }
    navigate(route);
  };

  return (
    <HomeContainer id="home-screen">
      <HomeMain>
        {/* 집 지붕 이미지 */}
        <RoofGraphic>
          <img src={roofImg} alt="집 지붕" />
        </RoofGraphic>

        {/* 8개 기능 카드 그리드 */}
        <CardGrid>
          {cards.map((card) => (
            <HomeCard
              key={card.id}
              $bgColor={card.bgColor}
              $shadowColor={card.shadowColor}
              onClick={() => handleCardClick(card.route, card.title)}
              type="button"
            >
              <CardTitle>{card.title}</CardTitle>
              <CardIcon src={card.vectorIcon} alt={`${card.title} 아이콘`} />
            </HomeCard>
          ))}
        </CardGrid>
      </HomeMain>

      <BottomNavigation />
    </HomeContainer>
  );
};

export default HomePage;
