import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const ButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.cardBackground};
  align-items: center;
  justify-content: center;
  elevation: 5;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
  z-index: 10;
`;

const ThemeToggleButton = ({ isDarkTheme, toggleTheme }) => {
  return (
    <ButtonContainer onPress={toggleTheme}>
      <Ionicons 
        name={isDarkTheme ? "sunny" : "moon"} 
        size={24} 
        color={isDarkTheme ? "#FFD700" : "#6200EE"} 
      />
    </ButtonContainer>
  );
};

export default ThemeToggleButton;