import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';
import mongLying from '../assets/mascot/mong_lying.png';

const SettingsMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px 40px 20px;
  gap: 20px;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.body};
  background-color: ${({ theme }) => theme.colors.cream};
  min-height: 100vh;
`;

/* Custom Header */
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  margin-top: 8px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #3E6433;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transition.fast};

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const HeaderTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 20px;
  font-weight: 400;
  color: #3E6433;
  margin-right: 32px; /* balance out back button to center-align */
  flex: 1;
  text-align: center;
`;

/* Profile Section */
const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

const AvatarRing = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  border: 2px solid #EFE7D3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: transparent;
`;

const Avatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 1px solid #EFE7D3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const AvatarMascot = styled.img`
  width: 86px;
  height: auto;
  object-fit: contain;
`;

const EditProfileBtn = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #F8E36B; /* Yellow color matching mockup */
  border: 2.5px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transition: transform ${({ theme }) => theme.transition.fast};

  &:active {
    transform: scale(0.92);
  }

  svg {
    width: 14px;
    height: 14px;
    display: block;
    color: #3A3A3A;
  }
`;

const NameInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 280px;
  background-color: #EAE5D3;
  border-radius: 24px;
  padding: 10px 16px;
  margin-bottom: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
`;

const NameInput = styled.input`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 18px;
  font-weight: 400;
  color: #3A3A3A;
  text-align: center;
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  max-width: 180px;
`;

const EditIcon = styled.span`
  display: flex;
  align-items: center;
  color: #7A7A7A;
  svg {
    width: 18px;
    height: 18px;
  }
`;

const RandomBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: #FFF8D1;
  border: 1.5px solid #F3DFBB;
  border-radius: 12px;
  padding: 6px 16px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 700;
  color: #9A6C1A;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transition.fast}, background-color ${({ theme }) => theme.transition.default};

  &:hover {
    background-color: #FFF2B3;
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* Option Section Card */
const SettingsCard = styled.section`
  width: 100%;
  background-color: #FEFAE8; /* theme.colors.surfaceWarm */
  border-radius: 28px;
  box-shadow: 0 4px 16px rgba(222, 214, 187, 0.25);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CardTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: #3A3A3A;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatusBadge = styled.span`
  background-color: #F3D8F7;
  color: #9C38A8;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

const OptionButton = styled.button<{ $selected: boolean; $selectType: 'personality' | 'tone' | 'meddle' }>`
  padding: 10px 18px;
  border-radius: 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transition.fast}, background-color ${({ theme }) => theme.transition.default}, color ${({ theme }) => theme.transition.default};
  border: none;
  outline: none;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }

  ${({ $selected, $selectType }) => {
    if (!$selected) {
      return css`
        background-color: #EAE5D3;
        color: #6A655A;
      `;
    }

    if ($selectType === 'personality') {
      return css`
        background-color: #F5A846; /* Orange color */
        color: #FFFFFF;
      `;
    }

    if ($selectType === 'tone') {
      return css`
        background-color: #FAADB4; /* Pink background */
        color: #8C383F; /* Crimson text */
      `;
    }

    if ($selectType === 'meddle') {
      return css`
        background-color: #BCEAF7; /* Sky blue background */
        color: #2E6575; /* Teal text */
      `;
    }
  }}
`;

/* Slider styles */
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #EAE5D3;
  outline: none;
  margin: 12px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #D83EF4; /* Bright purple */
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: transform ${({ theme }) => theme.transition.fast};

    &:active {
      transform: scale(1.15);
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: #D83EF4;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: transform ${({ theme }) => theme.transition.fast};

    &:active {
      transform: scale(1.15);
    }
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 4px;
  margin-bottom: 8px;
`;

const LabelText = styled.span<{ $active: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#8B2998' : '#B0A898')};
`;

const FreqSubtext = styled.p`
  font-size: 11px;
  color: #A5A094;
  text-align: center;
`;

/* Action Button */
const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #85AE7B;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 16px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(133, 174, 123, 0.3);
  transition: background-color ${({ theme }) => theme.transition.default}, transform ${({ theme }) => theme.transition.fast};
  border: none;
  outline: none;
  margin-top: 16px;

  &:hover {
    background-color: #5C8A4C;
  }

  &:active {
    transform: scale(0.985);
  }
`;

const PERSONALITIES = ['다정다감', '츤데레', '열정 가득', '차분한', '활발한', '엉뚱한', '똑부러지는', '느긋한'];
const TONES = ['존댓말', '반말', '반존대', '애교 섞인 말투', '무뚝뚝한 말투', '사무적인 말투', '애교쟁이 말투', '친구같은 말투', '사극 말투'];
const MEDDLES = ['엄마', '아빠', '언니', '동생', '오빠', '할머니', '할아버지'];
const FREQS = ['가끔', '적당히', '자주'];
const ADJECTIVES = [
  '용감무쌍', '반짝이는', '포근한', '춤추는', '노래하는', '잠자는', '멍때리는', '폭신한',
  '날아가는', '행복한', '말랑말랑', '새침떼기', '동글동글', '알뜰살뜰', '명상하는', '뒤뚱뒤뚱',
  '바람 부는', '구름 같은', '눈부신', '우주를 나는', '상상 속의', '꿀잠 자는', '뒹굴뒹굴', '졸린',
  '용감한', '사랑스런', '통통 튀는', '귀염뽀짝', '날렵한', '빛나는', '초록빛', '새콤달콤',
  '엉뚱한', '야무진', '느긋한', '신이 난', '바쁜', '따뜻한', '포슬포슬',
  '반짝반짝', '새싹 같은', '은하수 너머', '사락사락', '꼬물꼬물', '조그만', '덩치 큰', '소심한',
  '호기심 가득', '꿈꾸는', '노을빛', '파란 하늘', '보드라운', '사각사각', '촉촉한', '바삭바삭',
  '알록달록', '새하얀', '발랄한', '명랑한', '도도한', '시크한', '열정 가득', '우아한',
  '수줍은', '의젓한', '듬직한', '듬직듬직', '싱글벙글', '방글방글', '속삭이는', '재잘재잘',
  '아장아장', '갸우뚱', '동에 번쩍', '서에 번쩍', '하늘을 나는', '바다를 품은', '숲속의', '바람을 타는',
  '노래방 단골', '붕어빵 굽는', '이불 밖은 위험한', '집돌이', '소풍 가는', '별 헤는', '달콤한', '쌉싸름한',
  '밀크티 맛', '딸기 향', '초코 가득', '치즈 맛', '민트초코', '붕어빵 맛', '단팥 빵', '슈크림 든',
  '고구마 구운', '감자 튀긴', '버터 바른', '꿀을 흘린'
];

const NOUNS = [
  '파인애플', '바지', '붕어빵', '초코파이', '식빵', '무지개', '감자', '젤리',
  '토마토', '연필', '양말', '유리창', '구름', '도토리', '물고기', '바나나',
  '사과', '딸기', '토끼', '고양이', '강아지', '쿼카', '다람쥐', '펭귄',
  '솜사탕', '호떡', '우산', '풍선', '시계', '노트', '지우개', '크레파스',
  '아이스크림', '도넛', '마카롱', '단팥죽', '고구마', '피자', '스파게티', '떡볶이',
  '김밥', '붕어', '오리', '곰인형', '모자', '가방', '안경', '베개',
  '이불', '컵케이크', '우유', '요구르트', '푸딩', '사탕', '쿠키', '와플',
  '치즈', '버터', '식빵맨', '연날리기', '달팽이', '거북이', '개구리', '병아리',
  '기린', '코끼리', '여우', '사자', '펭귄', '판다', '햄스터', '코알라',
  '바다표범', '고래', '돌고래', '소라빵', '소금빵', '단팥빵', '카스텔라', '머핀',
  '크루아상', '베이글', '마늘빵', '붕어싸만코', '누룽지', '호두과자', '맛밤', '메론',
  '수박', '포도', '귤', '복숭아', '앵두', '자두', '레몬', '라임',
  '블루베리', '체리', '살구', '단감'
];

export const AssistantSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();

  // Reset core MainLayout header since we render a custom one on this empty layout page
  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      title: null,
      onRightClick: undefined,
    });
  }, [setHeaderConfig]);

  // Load from LocalStorage or default values
  const [name, setName] = useState(() => localStorage.getItem('assistantName') || '반짝이는 바지');
  const [personality, setPersonality] = useState(() => localStorage.getItem('assistantPersonality') || '다정다감');
  const [tone, setTone] = useState(() => localStorage.getItem('assistantTone') || '애교 섞인 말투');
  const [meddle, setMeddle] = useState(() => localStorage.getItem('assistantMeddle') || '엄마');
  const [freq, setFreq] = useState(() => {
    const saved = localStorage.getItem('assistantFreq');
    return saved !== null ? parseInt(saved, 10) : 1; // Default to '적당히' (1)
  });

  const handleRandomName = () => {
    let newName = '';
    let attempts = 0;
    do {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      newName = `${adj} ${noun}`;
      attempts++;
    } while (newName === name && attempts < 20);
    setName(newName);
  };

  const handleSave = () => {
    localStorage.setItem('assistantName', name.trim() || '반짝이는 바지');
    localStorage.setItem('assistantPersonality', personality);
    localStorage.setItem('assistantTone', tone);
    localStorage.setItem('assistantMeddle', meddle);
    localStorage.setItem('assistantFreq', freq.toString());

    // Back to my page
    navigate('/mypage');
  };

  return (
    <SettingsMain>
      <HeaderContainer>
        <BackButton onClick={() => navigate('/mypage')} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </BackButton>
        <HeaderTitle>나의 비서 설정</HeaderTitle>
      </HeaderContainer>

      <ProfileSection>
        <AvatarRing>
          <Avatar>
            <AvatarMascot src={mongLying} alt="몽이 프로필" />
          </Avatar>
          <EditProfileBtn type="button" aria-label="프로필 편집">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </EditProfileBtn>
        </AvatarRing>

        <NameInputContainer>
          <NameInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="비서 이름 입력"
            maxLength={12}
          />
          <EditIcon aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </EditIcon>
        </NameInputContainer>

        <RandomBtn type="button" onClick={handleRandomName}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
            <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
            <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
          랜덤 이름 짓기
        </RandomBtn>
      </ProfileSection>

      <SettingsCard>
        <CardTitleRow>
          <CardTitle>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            성격 설정
          </CardTitle>
        </CardTitleRow>
        <OptionsGrid>
          {PERSONALITIES.map(p => (
            <OptionButton
              key={p}
              type="button"
              $selected={personality === p}
              $selectType="personality"
              onClick={() => setPersonality(p)}
            >
              {p}
            </OptionButton>
          ))}
        </OptionsGrid>
      </SettingsCard>

      <SettingsCard>
        <CardTitleRow>
          <CardTitle>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            알림 말투
          </CardTitle>
        </CardTitleRow>
        <OptionsGrid>
          {TONES.map(t => (
            <OptionButton
              key={t}
              type="button"
              $selected={tone === t}
              $selectType="tone"
              onClick={() => setTone(t)}
            >
              {t}
            </OptionButton>
          ))}
        </OptionsGrid>
      </SettingsCard>

      <SettingsCard>
        <CardTitleRow>
          <CardTitle>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            참견 정도
          </CardTitle>
        </CardTitleRow>
        <OptionsGrid>
          {MEDDLES.map(m => (
            <OptionButton
              key={m}
              type="button"
              $selected={meddle === m}
              $selectType="meddle"
              onClick={() => setMeddle(m)}
            >
              {m}
            </OptionButton>
          ))}
        </OptionsGrid>
      </SettingsCard>

      <SettingsCard>
        <CardTitleRow>
          <CardTitle>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
            비서의 조언 빈도
          </CardTitle>
          <StatusBadge>{FREQS[freq]}</StatusBadge>
        </CardTitleRow>
        <SliderContainer>
          <StyledSlider
            type="range"
            min="0"
            max="2"
            value={freq}
            onChange={(e) => setFreq(parseInt(e.target.value, 10))}
          />
          <SliderLabels>
            <LabelText $active={freq === 0}>가끔</LabelText>
            <LabelText $active={freq === 1}>적당히</LabelText>
            <LabelText $active={freq === 2}>자주</LabelText>
          </SliderLabels>
          <FreqSubtext>[알림 설정에 영향이 갈 수 있어요!]</FreqSubtext>
        </SliderContainer>
      </SettingsCard>

      <SaveBtn type="button" onClick={handleSave}>
        설정 저장하기
      </SaveBtn>
    </SettingsMain>
  );
};

export default AssistantSettingsPage;
