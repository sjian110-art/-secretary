import React, { useEffect } from 'react';
import styled from 'styled-components';
import { fadeIn, popIn } from '../styles/GlobalStyle';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 100vh;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Backdrop = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(70, 45, 30, 0.35);
  cursor: pointer;
`;

const ModalContentWrapper = styled.div`
  position: relative;
  z-index: 2001;
  width: 86%;
  animation: ${popIn} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <Backdrop onClick={onClose} aria-label="팝업 닫기" type="button" />
      <ModalContentWrapper role="dialog" aria-modal="true">
        {children}
      </ModalContentWrapper>
    </ModalOverlay>
  );
};
