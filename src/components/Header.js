import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: relative;
  width: 100vw;
  z-index: 200;
  background: linear-gradient(90deg, #232526 0%, #005bea 100%);
  color: #fff;
  padding: 0.7rem 0;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);
  border-bottom: 1.5px solid #232526;
  transition: background 0.3s;
  min-height: 72px;
  display: flex;
  align-items: center;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-height: 64px;
`;

const Logo = styled.img`
  height: 2.2rem;
  width: 2.2rem;
  margin-right: 1.1rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.10));
  background: #fff;
  border-radius: 8px;
  border: 1.5px solid #232526;
  display: block;
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 2.1rem;
  letter-spacing: 0.01em;
  margin: 0;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.18);
  flex: 1;
  text-align: center;
`;

const Header = () => {
  // Use a static fallback logo if the main logo fails, but avoid infinite loop
  // Use the SVG logo in public/logo.svg, fallback to a generic SVG if missing
  const [logoSrc, setLogoSrc] = React.useState('/logo.svg');
  const handleLogoError = () => {
    if (logoSrc !== '/fallback-logo.svg') {
      setLogoSrc('/fallback-logo.svg');
    }
  };
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo src={logoSrc} alt="Logo" onError={handleLogoError} />
        <Title>Aircraft Checklist PDF Generator</Title>
        <div style={{ width: '2.2rem', marginLeft: '1.1rem' }} />
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
