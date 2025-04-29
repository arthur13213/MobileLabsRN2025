import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import NewsPost from '../components/NewsPost';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 10px;
`;

// Steam-related news images
const newsData = [
  {
    id: '1',
    title: 'Steam Deck OLED Now Available',
    image: 'https://cdn.cloudflare.steamstatic.com/steamdeck/images/SteamDeck_family.png',
    content: 'The Steam Deck OLED features a vibrant display, extended battery life and improved wireless connectivity.',
  },
  {
    id: '2',
    title: 'Steam Next Fest Returns',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/593110/capsule_616x353.jpg',
    content: 'Play hundreds of demos from upcoming games and chat with developers during our week-long celebration of games.',
  },
  {
    id: '3',
    title: 'Summer Sale Approaching',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/clusters/sale_autumn2023_assets/54b5034ec5d71d4e122acbd4/site_header_mobile_english.jpg',
    content: 'Get ready for the biggest sale event of the year with thousands of games discounted across all genres.',
  },
];

const CommunityScreen = ({ theme }) => {
  const isDarkTheme = theme?.background === '#121212'; // Check for dark theme
  
  return (
    <Container>
      <ThemeToggleButton isDarkTheme={isDarkTheme} toggleTheme={() => {}} />
      <FlatList
        data={newsData}
        renderItem={({ item }) => <NewsPost post={item} />}
        keyExtractor={item => item.id}
      />
    </Container>
  );
};

export default CommunityScreen;