import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, useWindowDimensions } from 'react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const imageSize = width * 0.25;

  const news = Array(4).fill({
    title: 'Важлива подія',
    date: '16.04.2025',
    description: 'Опис останньої події у світі технологій.',
    image: 'https://cdn-icons-png.flaticon.com/512/21/21601.png',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📰 Останні новини</Text>
      <FlatList
        data={news}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={[styles.image, { width: imageSize, height: imageSize }]} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef1f4', padding: 20 },
  header: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  image: { borderRadius: 8, marginRight: 15 },
  textBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  date: { fontSize: 12, color: '#666' },
  description: { fontSize: 14, color: '#444' },
});
