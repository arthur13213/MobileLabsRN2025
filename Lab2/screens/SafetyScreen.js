import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 20px;
`;

const Title = styled.Text`
  color: ${props => props.theme.text};
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Logo = styled.Image`
  width: 200px;
  height: 80px;
  align-self: center;
  margin-bottom: 20px;
`;

const Section = styled.View`
  background-color: ${props => props.theme.cardBackground};
  padding: 15px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.accent};
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const SectionContent = styled.Text`
  color: ${props => props.theme.text};
  font-size: 14px;
  text-align: center;
`;

const SteamGuardImage = styled.Image`
  width: 100px;
  height: 100px;
  align-self: center;
  margin-bottom: 10px;
`;

const generateRandomCode = () => {
  const chars = 'ABCDEF0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const SafetyScreen = ({ theme }) => {
  const [code, setCode] = useState(generateRandomCode());
  const isDarkTheme = theme?.background === '#121212'; // Check for dark theme

  useEffect(() => {
    const timer = setInterval(() => setCode(generateRandomCode()), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container>
      <ThemeToggleButton isDarkTheme={isDarkTheme} toggleTheme={() => {}} />
      <Logo 
        source={{ uri: 'https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg' }} 
        resizeMode="contain"
      />
      <Title>Steam Guard</Title>
      <Section>
        <SteamGuardImage 
          source={{ uri: 'https://help.steampowered.com/public/shared/images/steam/Steam_Guard.png' }} 
          resizeMode="contain"
        />
        <SectionTitle>{code}</SectionTitle>
        <SectionContent>Your Steam Guard code. Enter this code in your Steam client for verification.</SectionContent>
      </Section>
      <Section>
        <SectionTitle>Account Protection</SectionTitle>
        <SectionContent>Steam Guard adds an additional layer of security to your Steam account. Protect your games and inventory items.</SectionContent>
      </Section>
    </Container>
  );
};

export default SafetyScreen;