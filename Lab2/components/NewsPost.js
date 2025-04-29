import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  background-color: ${props => props.theme.cardBackground};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};
`;

const Image = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 6px;
`;

const Content = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
  opacity: 0.8;
`;

const NewsPost = ({ post }) => (
  <Container>
    <Image source={{ uri: post.image }} resizeMode="cover" />
    <Title>{post.title}</Title>
    <Content>{post.content}</Content>
  </Container>
);

export default NewsPost;