import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import mongBoring from '../assets/mascot/mong_boring.png';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.cream};
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  position: relative;
`;

const BackBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #EFEBD8; /* 시안 둥근 뒤로가기 배경 */
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #21160F;
  font-size: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #E2DCBF;
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-family: 'Jua', sans-serif;
  font-size: 20px;
  color: #2B4C20;
  margin: 0;
  margin-right: 40px; /* 뒤로가기 버튼 넓이만큼 마진을 주어 정중앙 정렬 */
`;

const Main = styled.main`
  flex: 1;
  padding: 16px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MascotWrapper = styled.div`
  width: 140px;
  height: 120px;
  margin-top: 16px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const InfoTitle = styled.h2`
  font-family: 'Jua', sans-serif;
  font-size: 24px;
  color: #21160F;
  margin: 0 0 16px 0;
  text-align: center;
`;

const InfoDesc = styled.p`
  color: #5C524B;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
  margin: 0 0 32px 0;
  word-break: keep-all;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const InputLabel = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  color: #2B4C20;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  align-self: flex-start;
`;

const InputWrapper = styled.div`
  background-color: #FFFDF5;
  border-radius: 28px;
  height: 56px;
  border: 1px solid #ECE7D4;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.01);
  width: 100%;
`;

const MailIcon = styled.span`
  font-size: 20px;
  color: #8C8A79;
  display: flex;
  align-items: center;
`;

const EmailInput = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  color: #21160F;
  flex: 1;
  min-width: 0;

  &::placeholder {
    color: #C4C0B4;
  }
`;

const SubmitBtn = styled.button`
  background-color: #83AC80; /* 시안 연녹색 버튼 */
  color: #FFFFFF;
  height: 52px;
  border-radius: 26px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 700;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 0 #6C8E69;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background-color: #749A71;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #6C8E69;
  }

  span.icon {
    font-size: 18px;
  }
`;

const TipCard = styled.div`
  background-color: #FFF9E3; /* 연노랑 팁 카드 */
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #ECE7D4;
  width: 100%;
  box-shadow: 0 4px 10px rgba(255, 249, 227, 0.3);
`;

const TipIcon = styled.span`
  color: #FFC000;
  font-size: 20px;
  flex-shrink: 0;
`;

const TipText = styled.p`
  color: #7D5B18;
  font-family: ${({ theme }) => theme.fonts.hand};
  font-size: 14px;
  line-height: 1.45;
  font-weight: 500;
  margin: 0;

  span.cs-link {
    color: #2F6FE0;
    text-decoration: underline;
    font-weight: bold;
    cursor: pointer;
  }
`;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      window.alert('이메일 주소를 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      window.alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 임시 연동 피드백
    window.alert(
      `비밀번호 재설정 메일이 ${email.trim()} 주소로 전송되었습니다.\n(참고: 본 기능은 추후 백엔드 인증 API 연동이 필요한 상태입니다.)`
    );
    navigate('/login');
  };

  return (
    <Container id="forgot-password-screen">
      <Header>
        <BackBtn type="button" onClick={() => navigate('/login')} aria-label="로그인 화면으로 돌아가기">
          ←
        </BackBtn>
        <HeaderTitle>비밀번호 찾기</HeaderTitle>
      </Header>

      <Main>
        <MascotWrapper>
          <img src={mongBoring} alt="슬퍼하는 몽이" />
        </MascotWrapper>

        <InfoTitle>비밀번호를 잊으셨나요?</InfoTitle>
        <InfoDesc>
          가입하신 이메일 주소를 입력해주시면
          <br />
          비밀번호 재설정 링크를 보내드려요.
        </InfoDesc>

        <Form onSubmit={handleSendEmail} noValidate>
          <div>
            <InputLabel>이메일 주소</InputLabel>
            <InputWrapper>
              <MailIcon>✉️</MailIcon>
              <EmailInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입하신 이메일을 입력해주세요"
              />
            </InputWrapper>
          </div>

          <SubmitBtn type="submit">
            <span className="icon">✈️</span>
            <span>비밀번호 재설정 메일 보내기</span>
          </SubmitBtn>
        </Form>

        <TipCard>
          <TipIcon>💡</TipIcon>
          <TipText>
            이메일이 오지 않는다면 스팸 메일함을 확인해주세요. 그래도 메일을 받지 못하셨다면{' '}
            <span className="cs-link" onClick={() => window.alert('고객센터 문의 기능은 준비 중입니다.')}>
              고객센터
            </span>
            로 문의해주세요.
          </TipText>
        </TipCard>
      </Main>
    </Container>
  );
};

export default ForgotPasswordPage;
