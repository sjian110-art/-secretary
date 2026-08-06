import React from 'react';
import styled, { css } from 'styled-components';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'warm';
  size?: 'sm' | 'lg';
  children: React.ReactNode;
}

const StyledCard = styled.div<{
  $variant: 'white' | 'warm';
  $size: 'sm' | 'lg';
}>`
  background-color: ${({ theme, $variant }) =>
    $variant === 'warm' ? theme.colors.surfaceWarm : theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.default};
  
  ${({ theme, $size }) =>
    $size === 'sm'
      ? css`
          border-radius: ${theme.radius.cardSm};
          padding: ${theme.spacing[2]};
        `
      : css`
          border-radius: ${theme.radius.cardLg};
          padding: ${theme.spacing[3]};
        `}
`;

export const Card: React.FC<CardProps> = ({
  variant = 'white',
  size = 'lg',
  children,
  ...props
}) => {
  return (
    <StyledCard $variant={variant} $size={size} {...props}>
      {children}
    </StyledCard>
  );
};
