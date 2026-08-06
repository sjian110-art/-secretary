import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { fadeIn } from '../styles/GlobalStyle';

export interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const ToastWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: min(88%, 420px);
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.textWhite};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadow.default};
  z-index: 3000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translate(-50%, 10px);

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      opacity: 0.95;
      transform: translate(-50%, 0);
      animation: ${fadeIn} 0.2s ease-out;
    `}
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  isOpen,
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return <ToastWrapper $isOpen={isOpen}>{message}</ToastWrapper>;
};
