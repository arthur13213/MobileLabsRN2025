import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';

export default function PhotosScreen() {
  const images = [
    'https://kor.ill.in.ua/m/610x385/4316278.jpg',
    'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/40f5/live/a000d720-243d-11f0-b26b-ab62c890638b.jpg.webp',
    'https://static.nv.ua/shared/system/Article/posters/003/080/630/original/77badded492f2c9b68eee897b7930db8.jpg?q=85&stamp=20250429102433',
    'https://images.unian.net/photos/2025_04/1745941488-2922.jpg?r=674555',
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📸 Фотогалерея</Text>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f0f4f7', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  image: {
    width: '48%',
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#ddd',
  },
});
