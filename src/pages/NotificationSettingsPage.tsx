import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useHeader } from '../contexts/HeaderContext';

// 알림 빈도 타입
type FrequencyType = 'low' | 'normal' | 'high';

const SettingsContainer = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px 20px 40px 20px;
  gap: 16px;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.body};
  background-color: ${({ theme }) => theme.colors.cream};
  box-sizing: border-box;
`;

const SectionCard = styled.section<{ $disabled?: boolean }>`
  width: 100%;
  background-color: #FEFAE8; /* theme.colors.surfaceWarm */
  border-radius: 24px;
  padding: 20px 20px;
  box-shadow: 0 4px 12px rgba(33, 22, 15, 0.02);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: opacity 0.25s ease;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

/* 좌우 배치형 로우 */
const RowAlign = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
`;

const MainLabel = styled.span<{ $isWarning?: boolean }>`
  font-size: 15px;
  font-weight: bold;
  color: ${({ $isWarning }) => ($isWarning ? '#A67C33' : '#3A3A3A')};
`;

const SubLabel = styled.span`
  font-size: 12px;
  color: #8A8A8A;
`;

/* 🔔 토글 스위치 (Switch) 컴포넌트 */
interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

const SwitchContainer = styled.div<{ $checked: boolean }>`
  width: 48px;
  height: 26px;
  background-color: ${({ $checked }) => ($checked ? '#1B4C15' : '#DCD9CE')};
  border-radius: 999px;
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: ${({ $checked }) => ($checked ? 'flex-end' : 'flex-start')};
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const SwitchKnob = styled.div`
  width: 22px;
  height: 22px;
  background-color: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.5, 1.5, 0.5, 1);
`;

const ToggleSwitch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <SwitchContainer $checked={checked} onClick={onChange} aria-label="토글 스위치" role="switch" aria-checked={checked}>
      <SwitchKnob />
    </SwitchContainer>
  );
};

/* 알림 빈도 섹션 */
const FrequencyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: #3A3A3A;
  font-size: 15px;
  font-weight: bold;

  svg {
    fill: #7D511E; /* 갈색 종 아이콘 */
  }
`;

const FrequencyButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const FrequencyButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 38px;
  border-radius: 20px;
  border: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  ${({ $active }) =>
    $active
      ? css`
          background-color: #1B4C15; /* 활성 상태: 짙은 초록 */
          color: #FFFFFF;
        `
      : css`
          background-color: #EFEAE0; /* 비활성 상태: 연한 베이지 */
          color: #5E5340;
        `}
`;

/* 항목별 설정 */
const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: bold;
  color: #3A3A3A;
  margin: 0 0 12px 0;
  text-align: left;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #EFEAE0;
  margin-bottom: 16px;
`;

const SettingItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
`;

const ItemLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #4A4A4A;
`;

/* 하단 안내 배너 */
const BannerContainer = styled.div`
  width: 100%;
  background-color: #FFFFFF;
  border: 1px dashed #E5DCC4;
  border-radius: 9999px;
  padding: 12px 20px;
  box-sizing: border-box;
  text-align: center;
  margin-top: 8px;
`;

const BannerText = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: bold;
  color: #7A624E;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const NotificationSettingsPage: React.FC = () => {
  const { setHeaderConfig } = useHeader();

  // 설정 상태 관리
  const [allAlerts, setAllAlerts] = useState(true);
  const [frequency, setFrequency] = useState<FrequencyType>('normal');
  const [nightMute, setNightMute] = useState(true);
  const [budgetAlert, setBudgetAlert] = useState(true);
  const [reportAlert, setReportAlert] = useState(true);
  const [challengeAlert, setChallengeAlert] = useState(false);
  const [centerAlert, setCenterAlert] = useState(false);
  const [marketingAlert, setMarketingAlert] = useState(false);

  // 헤더 바인딩
  useEffect(() => {
    setHeaderConfig({
      showBackButton: true,
      title: '알림 설정',
      showNotification: false, // 알림 설정 페이지에서는 벨 아이콘을 끕니다.
    });
  }, [setHeaderConfig]);

  return (
    <SettingsContainer id="notification-settings-screen">
      {/* 1. 비서 알림 설정 */}
      <SectionCard>
        <RowAlign>
          <TextGroup>
            <MainLabel>비서 알림 설정</MainLabel>
            <SubLabel>모든 말랑이 알림 켜기/끄기</SubLabel>
          </TextGroup>
          <ToggleSwitch checked={allAlerts} onChange={() => setAllAlerts((prev) => !prev)} />
        </RowAlign>
      </SectionCard>

      {/* 2. 알림 빈도 */}
      <SectionCard $disabled={!allAlerts}>
        <FrequencyHeader>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M12 2C10.3 2 9 3.3 9 5V5.4C6.6 6.2 5 8.4 5 11V15L3 18H21L19 15V11C19 8.4 17.4 6.2 15 5.4V5C15 3.3 13.7 2 12 2ZM9.5 18.2C9.5 19.5 10.6 20.5 12 20.5C13.4 20.5 14.5 19.5 14.5 18.2" />
          </svg>
          <span>알림 빈도</span>
        </FrequencyHeader>
        <FrequencyButtonGroup>
          <FrequencyButton $active={frequency === 'low'} onClick={() => setFrequency('low')} type="button">
            낮음
          </FrequencyButton>
          <FrequencyButton $active={frequency === 'normal'} onClick={() => setFrequency('normal')} type="button">
            보통
          </FrequencyButton>
          <FrequencyButton $active={frequency === 'high'} onClick={() => setFrequency('high')} type="button">
            자주
          </FrequencyButton>
        </FrequencyButtonGroup>
      </SectionCard>

      {/* 3. 야간 알림 방지 */}
      <SectionCard $disabled={!allAlerts}>
        <RowAlign>
          <TextGroup>
            <MainLabel>야간 알림 방지</MainLabel>
            <SubLabel>22:00 ~ 08:00 알림 끄기</SubLabel>
          </TextGroup>
          <ToggleSwitch checked={nightMute} onChange={() => setNightMute((prev) => !prev)} />
        </RowAlign>
      </SectionCard>

      {/* 4. 항목별 설정 */}
      <SectionCard $disabled={!allAlerts}>
        <SectionTitle>항목별 설정</SectionTitle>
        <Divider />
        <SettingItemRow>
          <ItemLabel>예산 알림</ItemLabel>
          <ToggleSwitch checked={budgetAlert} onChange={() => setBudgetAlert((prev) => !prev)} />
        </SettingItemRow>
        <SettingItemRow>
          <ItemLabel>소비 리포트</ItemLabel>
          <ToggleSwitch checked={reportAlert} onChange={() => setReportAlert((prev) => !prev)} />
        </SettingItemRow>
        <SettingItemRow>
          <ItemLabel>챌린지 달성 알림</ItemLabel>
          <ToggleSwitch checked={challengeAlert} onChange={() => setChallengeAlert((prev) => !prev)} />
        </SettingItemRow>
        <SettingItemRow>
          <ItemLabel>고객센터 알림</ItemLabel>
          <ToggleSwitch checked={centerAlert} onChange={() => setCenterAlert((prev) => !prev)} />
        </SettingItemRow>
      </SectionCard>

      {/* 5. 마케팅 정보 수신 */}
      <SectionCard>
        <RowAlign>
          <TextGroup>
            <MainLabel $isWarning={true}>마케팅 정보 수신</MainLabel>
            <SubLabel>혜택 및 이벤트 알림</SubLabel>
          </TextGroup>
          <ToggleSwitch checked={marketingAlert} onChange={() => setMarketingAlert((prev) => !prev)} />
        </RowAlign>
      </SectionCard>

      {/* 6. 하단 안내 문구 */}
      <BannerContainer>
        <BannerText>
          몽이의 소식을 놓치지 않으려면 알림을 켜주세요! 💗
        </BannerText>
      </BannerContainer>
    </SettingsContainer>
  );
};

export default NotificationSettingsPage;
