import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    pass: '',
    repeat: '',
  });

  const handleChange = (field, val) => {
    setForm({ ...form, [field]: val });
  };

  const handleSubmit = () => {
    if (form.pass !== form.repeat) {
      alert('❌ Паролі не збігаються!');
    } else {
      alert(`✅ Вітаємо, ${form.fname} ${form.lname}`);
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Text style={styles.heading}>👤 Мій профіль</Text>
      <TextInput style={styles.input} placeholder="Ім’я" onChangeText={v => handleChange('fname', v)} />
      <TextInput style={styles.input} placeholder="Прізвище" onChangeText={v => handleChange('lname', v)} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={v => handleChange('email', v)} />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry onChangeText={v => handleChange('pass', v)} />
      <TextInput style={styles.input} placeholder="Повторіть пароль" secureTextEntry onChangeText={v => handleChange('repeat', v)} />
      <View style={styles.buttonContainer}>
        <Button title="Зберегти" onPress={handleSubmit} color="#0a84ff" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 20, backgroundColor: '#f2f6fc' },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
