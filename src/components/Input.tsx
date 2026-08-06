import React from 'react';
import styled, { css } from 'styled-components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.2px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInputElement = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: ${({ theme }) => theme.size.inputHeight};
  background-color: ${({ theme }) => theme.colors.dangerBg}; /* Default light pink bg */
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 2px solid transparent;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  transition:
    border-color ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default},
    background-color ${({ theme }) => theme.transition.default};
  display: block;

  &::placeholder {
    color: #C8B5B5;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(133, 174, 123, 0.20);
    outline: none;
    background-color: #FAFFF8;
  }

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.danger} !important;
      background-color: #FFF5F5 !important;
      box-shadow: 0 0 0 3px rgba(224, 85, 85, 0.12) !important;
    `}
`;

const ErrorText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  min-height: 16px;
  padding-left: 6px;
  letter-spacing: -0.1px;
`;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <Group>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <InputWrapper>
          <StyledInputElement
            ref={ref}
            $hasError={!!error}
            {...props}
          />
        </InputWrapper>
        <ErrorText role="alert">{error || ''}</ErrorText>
      </Group>
    );
  }
);

Input.displayName = 'Input';
