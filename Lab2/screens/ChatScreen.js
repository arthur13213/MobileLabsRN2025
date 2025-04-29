import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import ChatItem from '../components/ChatItem';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 10px;
`;

// Steam-themed users
const chatsData = [
  { 
    id: '1', 
    name: 'ValveEmployee', 
    avatar: 'https://avatars.steamstatic.com/17f10c9eb29c6efa9650a1fd73be988e44837e3a_full.jpg', 
    lastMessage: 'Check out our new releases!' 
  },
  { 
    id: '2', 
    name: 'GabeN', 
    avatar: 'https://avatars.steamstatic.com/0a251c8d9828ce8be5a2efa5d6617fb303148b55_full.jpg', 
    lastMessage: 'Welcome to Steam' 
  },
  { 
    id: '3', 
    name: 'GameDev_Studio', 
    avatar: 'https://avatars.steamstatic.com/fc476306bbfc257823ed4c1fa33fcd02afdb132a_full.jpg', 
    lastMessage: 'Thanks for playing our game!' 
  },
];

const ChatScreen = ({ theme }) => {
  const isDarkTheme = theme?.background === '#121212'; // Check for dark theme
  
  return (
    <Container>
      <ThemeToggleButton isDarkTheme={isDarkTheme} toggleTheme={() => {}} />
      <FlatList
        data={chatsData}
        renderItem={({ item }) => <ChatItem chat={item} />}
        keyExtractor={item => item.id}
      />
    </Container>
  );
};

export default ChatScreen;