import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  border-width: 1px;
  border-color: ${props => props.theme.accent};
`;

const Info = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: bold;
`;

const Message = styled.Text`
  color: ${props => props.theme.text};
  font-size: 14px;
  opacity: 0.8;
`;

const ChatItem = ({ chat }) => (
  <Container>
    <Avatar source={{ uri: chat.avatar }} />
    <Info>
      <Name>{chat.name}</Name>
      <Message>{chat.lastMessage}</Message>
    </Info>
  </Container>
);

export default ChatItem;
