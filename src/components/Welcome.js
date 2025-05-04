import React from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  margin-bottom: 2rem;
  padding: 2.2rem 2.5rem 1.7rem 2.5rem;
  background: rgba(24,28,36, 0.98);
  color: #f3f3f3;
  border-radius: 18px;
  border: 1.5px solid #232526;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.22);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const WelcomeTitle = styled.h2`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.18);
`;

const WelcomeText = styled.p`
  margin-bottom: 0.95rem;
  line-height: 1.7;
  color: #b3b3b3;
  font-size: 1.13rem;
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
  background: linear-gradient(90deg, #005bea 0%, #00c6fb 100%);
  color: white;
  padding: 0.18rem 0.7rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-left: 0.7rem;
  vertical-align: middle;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
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
