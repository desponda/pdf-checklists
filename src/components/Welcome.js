import React from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #E3FCEF;
  border-radius: 6px;
  border-left: 4px solid #36B37E;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.4rem;
  color: #253858;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  margin-bottom: 0.75rem;
  line-height: 1.5;
  color: #42526E;
`;

const StepsList = styled.ol`
  margin-left: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StepItem = styled.li`
  margin-bottom: 0.5rem;
  color: #42526E;
`;

const Badge = styled.span`
  background-color: #0052CC;
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  vertical-align: middle;
`;

const Welcome = () => {
  return (
    <WelcomeContainer>
      <WelcomeTitle>
        Welcome to the Aircraft Checklist PDF Generator 
        <Badge>v1.0</Badge>
      </WelcomeTitle>
      <WelcomeText>
        This application allows you to download complete checklists for Microsoft Flight Simulator aircraft as PDF documents.
        Perfect for printing or viewing on a tablet during your flights!
      </WelcomeText>
      
      <WelcomeText>
        This tool helps pilots organize their flight preparation by combining all checklist pages into a single, 
        convenient PDF document that can be saved or printed.
      </WelcomeText>
      
      <WelcomeText style={{ fontStyle: 'italic', marginTop: '1rem' }}>
        All checklists are sourced from <a href="https://msfschecklist.de/ebag/" target="_blank" rel="noopener noreferrer">msfschecklist.de</a> and 
        compiled into single PDF documents for your convenience.
      </WelcomeText>
    </WelcomeContainer>
  );
};

export default Welcome;
