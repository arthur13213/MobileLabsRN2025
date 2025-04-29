import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 20px;
  align-items: center;
`;

const Card = styled.View`
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 20px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
  margin-bottom: 20px;
`;

const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 15px;
  border-width: 2px;
  border-color: ${props => props.theme.accent};
`;

const Name = styled.Text`
  color: ${props => props.theme.text};
  font-size: 20px;
  font-weight: bold;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.accent};
  align-self: flex-start;
  margin-bottom: 10px;
`;

const GameItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
`;

const GameImage = styled.Image`
  width: 60px;
  height: 80px;
  border-radius: 6px;
  margin-right: 10px;
`;

const GameTitle = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const ProfileScreen = ({ theme }) => {
  const isDarkTheme = theme?.background === '#121212'; // Check for dark theme
  
  const games = [
    { id: '1', title: 'Red Dead Redemption 2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg' },
    { id: '2', title: 'Baldur\'s Gate 3', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg' },
  ];

  return (
    <Container>
      <ThemeToggleButton isDarkTheme={isDarkTheme} toggleTheme={() => {}} />
      <Card>
        <Avatar source={{ uri: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' }} />
        <Name>SteamGamer_99</Name>
      </Card>
      <SectionTitle>Recently Played</SectionTitle>
      <FlatList
        data={games}
        renderItem={({ item }) => (
          <GameItem>
            <GameImage source={{ uri: item.image }} />
            <GameTitle>{item.title}</GameTitle>
          </GameItem>
        )}
        keyExtractor={item => item.id}
        style={{ width: '100%' }}
      />
    </Container>
  );
};

export default ProfileScreen;