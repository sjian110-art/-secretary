import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'full';
  children: React.ReactNode;
}

const getVariantStyle = (variant: 'primary' | 'secondary' | 'danger') => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.textWhite};
        box-shadow: 0 4px 0 ${({ theme }) => theme.colors.primaryDeep};

        &:hover:not(:disabled) {
          background-color: #95BC8B;
        }

        &:active:not(:disabled) {
          transform: translateY(4px);
          box-shadow: 0 0 0 ${({ theme }) => theme.colors.primaryDeep};
          background-color: #78A06E;
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.creamDark};
        color: ${({ theme }) => theme.colors.primaryDark};
        box-shadow: 0 4px 0 ${({ theme }) => theme.colors.gray300};

        &:hover:not(:disabled) {
          background-color: #F5ECA8;
        }

        &:active:not(:disabled) {
          transform: translateY(4px);
          box-shadow: 0 0 0 ${({ theme }) => theme.colors.gray300};
        }
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.colors.dangerBg};
        color: ${({ theme }) => theme.colors.danger};
        box-shadow: 0 4px 0 #E8C0C0;

        &:hover:not(:disabled) {
          background-color: #FFE4E4;
        }

        &:active:not(:disabled) {
          transform: translateY(4px);
          box-shadow: none;
        }
      `;
  }
};

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'danger';
  $size: 'sm' | 'md' | 'full';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  height: ${({ theme }) => theme.size.btnHeight};
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radius.btn};
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  letter-spacing: 0.3px;
  transition:
    background-color ${({ theme }) => theme.transition.default},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    opacity ${({ theme }) => theme.transition.default};
  white-space: nowrap;
  position: relative;
  outline: none;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  ${({ $size }) =>
    $size === 'full' &&
    css`
      width: 100%;
    `}

  ${({ $size }) =>
    $size === 'sm' &&
    css`
      height: ${({ theme }) => theme.size.btnHeightSm};
      font-size: 14px;
      padding: 0 ${({ theme }) => theme.spacing[2]};
    `}

  ${({ $variant }) => getVariantStyle($variant)}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
};
