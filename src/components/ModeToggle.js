import React from 'react';
import styled from 'styled-components';

const ModeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.sm} 0 ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ToggleContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #f5f7fa;
  color: ${props => props.$darkMode ? '#dadde1' : '#333'};
  
  &:hover {
    background-color: #eef1f5;
  }
`;

const ToggleSwitch = styled.span`
  position: relative;
  width: 50px;
  height: 24px;
  margin-right: 10px;
`;

const ToggleTrack = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.$darkMode ? '#2c3e50' : '#ccc'};
  border-radius: 30px;
  transition: all 0.3s ease;
`;

const ToggleThumb = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transform: ${props => props.$darkMode ? 'translateX(26px)' : 'translateX(0)'};
`;

const ToggleIcon = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  z-index: 2;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 0 7px;
  color: #333;
`;

const ToggleLabel = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

const ModeDescription = styled.span`
  font-size: 12px;
  color: #6B778C;
  display: block;
  margin-top: 5px;
  text-align: center;
`;

const ModeToggle = ({ preferDarkMode, onToggle }) => {
  return (
    <ModeWrapper>
      <ToggleContainer>
        <ToggleButton
          $darkMode={preferDarkMode}
          onClick={() => onToggle(!preferDarkMode)}
          aria-pressed={preferDarkMode}
        >
          <ToggleSwitch>
            <ToggleIcon>
              {preferDarkMode ? '☾' : '☀'}
            </ToggleIcon>
            <ToggleTrack $darkMode={preferDarkMode} />
            <ToggleThumb $darkMode={preferDarkMode} />
          </ToggleSwitch>
          <ToggleLabel>
            {preferDarkMode ? 'Dark Mode' : 'Light Mode'}
          </ToggleLabel>
        </ToggleButton>
      </ToggleContainer>
      <ModeDescription>
        {preferDarkMode
          ? 'Showing dark variants when available'
          : 'Showing standard variants (select dark mode to see dark variants)'}
      </ModeDescription>
    </ModeWrapper>
  );
};

export default ModeToggle;
