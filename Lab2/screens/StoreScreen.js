import React from 'react';
import { FlatList, TouchableOpacity, Alert, View } from 'react-native';
import styled from 'styled-components/native';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 15px;
`;

const Card = styled.View`
  background-color: ${props => props.theme.cardBackground};
  margin-bottom: 15px;
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
  elevation: 4;
`;

const GameImage = styled.Image`
  width: 100%;
  height: 180px;
`;

const GameContent = styled.View`
  padding: 15px;
`;

const GameTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 5px;
`;

const GameDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
  opacity: 0.8;
  margin-bottom: 10px;
`;

const GamePrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.accent};
`;

// Steam images for games
const gamesList = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    description: 'An open-world RPG set in Night City, a megalopolis obsessed with power, glamour and body modification.',
    price: '$59.99',
  },
  {
    id: '2',
    title: 'Stardew Valley',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
    description: 'Create the farm of your dreams: Turn your overgrown fields into a lively and bountiful farm!',
    price: '$14.99',
  },
  {
    id: '3',
    title: 'Hogwarts Legacy',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
    description: 'Experience Hogwarts in the 1800s. Your character is a student with the rare ability to manipulate ancient magic.',
    price: '$59.99',
  },
  {
    id: '4',
    title: 'Elden Ring',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    description: 'A fantasy action-RPG adventure set in a world created by Hidetaka Miyazaki and George R. R. Martin.',
    price: '$59.99',
  },
];

export default function StoreScreen({ toggleTheme, theme }) {
  const isDarkTheme = theme?.background === '#121212'; // Check for dark theme

  const handlePress = (game) => {
    Alert.alert(game.title, game.description);
  };

  return (
    <Container>
      <ThemeToggleButton isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      <FlatList
        data={gamesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <Card>
              <GameImage source={{ uri: item.image }} resizeMode="cover" />
              <GameContent>
                <GameTitle>{item.title}</GameTitle>
                <GameDescription>{item.description}</GameDescription>
                <GamePrice>{item.price}</GamePrice>
              </GameContent>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}