import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled Components
const FloatingContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    width: calc(100% - 2rem);
    padding: 0.75rem;
  }
`;

const GenerateButton = styled.button`
  background-color: #0747A6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.9rem 1.8rem;
  box-shadow: 0 4px 8px rgba(7, 71, 166, 0.2);
  transition: all 0.3s ease;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background-color: #0052CC;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(7, 71, 166, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(7, 71, 166, 0.2);
  }
  
  &:disabled {
    background-color: #97A0AF;
    opacity: 0.8;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const Spinner = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s linear infinite;
`;

const ProgressContainer = styled.div`
  margin-top: 0.5rem;
  width: 100%;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #0747A6;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  text-align: right;
  color: #6c757d;
`;

const Tip = styled.p`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #6B778C;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoMessage = styled.p`
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.span`
  font-size: 1.1rem;
  color: #28a745;
`;

const TipIcon = styled.span`
  font-size: 1.1rem;
`;

const FloatingButton = ({ 
  onClick, 
  disabled, 
  loading, 
  selectedAircraft, 
  selectedVariant,
  progress 
}) => {
  return (
    <FloatingContainer>
      <GenerateButton 
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <Spinner />
            Generating PDF...
          </>
        ) : (
          <>
            <ButtonIcon>📄</ButtonIcon>
            Generate PDF Checklist
          </>
        )}
      </GenerateButton>
      
      {loading && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <ProgressText>{progress}%</ProgressText>
        </ProgressContainer>
      )}
      
      {!selectedAircraft && (
        <Tip>
          <TipIcon>💡</TipIcon>
          Please select an aircraft to generate a PDF checklist
        </Tip>
      )}
      
      {selectedAircraft && selectedVariant && !loading && (
        <InfoMessage>
          <InfoIcon>✓</InfoIcon>
          Ready to generate checklist for <strong>{selectedAircraft}</strong>
          {selectedVariant !== 'standard' ? ` (${selectedVariant})` : ''}
        </InfoMessage>
      )}
    </FloatingContainer>
  );
};

export default FloatingButton;
