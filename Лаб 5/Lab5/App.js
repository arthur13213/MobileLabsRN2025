import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// Робоча директорія
const APP_DATA_DIR = `${FileSystem.documentDirectory}AppData/`;

// Основний компонент
export default function App() {
  const [currentPath, setCurrentPath] = useState(APP_DATA_DIR);
  const [files, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [storageInfo, setStorageInfo] = useState({ total: 0, free: 0, used: 0 });

  // Ініціалізація директорії AppData
  useEffect(() => {
    const initializeAppDataDir = async () => {
      const dirInfo = await FileSystem.getInfoAsync(APP_DATA_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(APP_DATA_DIR, { intermediates: true });
      }
      loadFiles(APP_DATA_DIR);
      loadStorageInfo();
    };
    initializeAppDataDir();
  }, []);

  // Завантаження вмісту директорії
  const loadFiles = async (path) => {
    try {
      const fileList = await FileSystem.readDirectoryAsync(path);
      const detailedFiles = await Promise.all(
        fileList.map(async (name) => {
          const fullPath = `${path}${name}`;
          const info = await FileSystem.getInfoAsync(fullPath);
          return {
            name,
            path: fullPath,
            isDirectory: info.isDirectory,
            size: info.size || 0,
            modificationTime: info.modificationTime
              ? new Date(info.modificationTime * 1000).toLocaleString()
              : 'Невідомо',
            extension: info.isDirectory ? 'folder' : name.split('.').pop()?.toLowerCase() || '',
          };
        })
      );
      setFiles(detailedFiles);
      setCurrentPath(path);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося завантажити вміст директорії');
    }
  };

  // Завантаження статистики пам’яті
  const loadStorageInfo = async () => {
    try {
      const totalSpace = 1000000000; // Приклад: 1GB (для Snack точні значення недоступні)
      const freeSpace = await FileSystem.getFreeDiskStorageAsync();
      const usedSpace = totalSpace - freeSpace;
      setStorageInfo({
        total: (totalSpace / 1024 / 1024).toFixed(2), // MB
        free: (freeSpace / 1024 / 1024).toFixed(2), // MB
        used: (usedSpace / 1024 / 1024).toFixed(2), // MB
      });
    } catch (error) {
      console.log('Помилка отримання статистики пам’яті:', error);
    }
  };

  // Навігація вгору
  const goUp = () => {
    if (currentPath === APP_DATA_DIR) return;
    const parentPath = currentPath.split('/').slice(0, -2).join('/') + '/';
    loadFiles(parentPath);
  };

  // Перехід у папку
  const navigateToFolder = (folderPath) => {
    loadFiles(folderPath);
  };

  // Створення папки
  const createFolder = async () => {
    if (!inputValue) {
      Alert.alert('Помилка', 'Введіть назву папки');
      return;
    }
    try {
      const folderPath = `${currentPath}${inputValue}`;
      await FileSystem.makeDirectoryAsync(folderPath);
      loadFiles(currentPath);
      setModalVisible(false);
      setInputValue('');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося створити папку');
    }
  };

  // Створення файлу
  const createFile = async () => {
    if (!inputValue) {
      Alert.alert('Помилка', 'Введіть назву файлу та вміст');
      return;
    }
    try {
      const filePath = `${currentPath}${inputValue}.txt`;
      await FileSystem.writeAsStringAsync(filePath, inputValue);
      loadFiles(currentPath);
      setModalVisible(false);
      setInputValue('');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося створити файл');
    }
  };

  // Читання файлу
  const readFile = async (filePath) => {
    try {
      const content = await FileSystem.readAsStringAsync(filePath);
      setSelectedFile({ path: filePath, content });
      setModalType('edit');
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося прочитати файл');
    }
  };

  // Редагування файлу
  const saveFile = async () => {
    if (!inputValue || !selectedFile) return;
    try {
      await FileSystem.writeAsStringAsync(selectedFile.path, inputValue);
      loadFiles(currentPath);
      setModalVisible(false);
      setInputValue('');
      setSelectedFile(null);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти файл');
    }
  };

  // Видалення файлу/папки
  const deleteItem = (item) => {
    Alert.alert(
      'Підтвердження',
      `Ви впевнені, що хочете видалити ${item.name}?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              if (item.isDirectory) {
                await FileSystem.deleteAsync(item.path);
              } else {
                await FileSystem.deleteAsync(item.path);
              }
              loadFiles(currentPath);
            } catch (error) {
              Alert.alert('Помилка', 'Не вдалося видалити елемент');
            }
          },
        },
      ]
    );
  };

  // Відображення деталей файлу
  const showFileDetails = (item) => {
    setSelectedFile(item);
    setModalType('details');
    setModalVisible(true);
  };

  // Рендеринг елемента файлу/папки
  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeIn" style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (item.isDirectory ? navigateToFolder(item.path) : readFile(item.path))}
      >
        <Ionicons
          name={item.isDirectory ? 'folder' : 'document-text'}
          size={24}
          color={item.isDirectory ? '#FFD700' : '#4682B4'}
        />
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemInfo}>
            {item.isDirectory ? 'Папка' : `Файл (${item.extension})`} | {item.size} байт
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => showFileDetails(item)}>
        <Ionicons name="information-circle" size={24} color="#4682B4" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(item)}>
        <Ionicons name="trash" size={24} color="#FF6347" />
      </TouchableOpacity>
    </Animatable.View>
  );

  // Рендеринг модального вікна
  const renderModal = () => (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <Animatable.View animation="zoomIn" style={styles.modalContent}>
          {modalType === 'createFolder' && (
            <>
              <Text style={styles.modalTitle}>Створити папку</Text>
              <TextInput
                style={styles.input}
                placeholder="Назва папки"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Скасувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={createFolder}>
                  <Text style={styles.buttonText}>Створити</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {modalType === 'createFile' && (
            <>
              <Text style={styles.modalTitle}>Створити файл</Text>
              <TextInput
                style={styles.input}
                placeholder="Назва файлу (без .txt)"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Скасувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={createFile}>
                  <Text style={styles.buttonText}>Створити</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {modalType === 'edit' && (
            <>
              <Text style={styles.modalTitle}>Редагувати файл</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                placeholder="Вміст файлу"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Скасувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={saveFile}>
                  <Text style={styles.buttonText}>Зберегти</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {modalType === 'details' && selectedFile && (
            <>
              <Text style={styles.modalTitle}>Деталі файлу</Text>
              <Text style={styles.detailText}>Назва: {selectedFile.name}</Text>
              <Text style={styles.detailText}>
                Тип: {selectedFile.isDirectory ? 'Папка' : `Файл (${selectedFile.extension})`}
              </Text>
              <Text style={styles.detailText}>Розмір: {selectedFile.size} байт</Text>
              <Text style={styles.detailText}>
                Останнє редагування: {selectedFile.modificationTime}
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Закрити</Text>
              </TouchableOpacity>
            </>
          )}
        </Animatable.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Файловий менеджер</Text>
        <View style={styles.storageInfo}>
          <Text style={styles.storageText}>Загалом: {storageInfo.total} MB</Text>
          <Text style={styles.storageText}>Вільно: {storageInfo.free} MB</Text>
          <Text style={styles.storageText}>Зайнято: {storageInfo.used} MB</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                { width: `${(storageInfo.used / storageInfo.total) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={goUp} disabled={currentPath === APP_DATA_DIR}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={currentPath === APP_DATA_DIR ? '#ccc' : '#4682B4'}
          />
        </TouchableOpacity>
        <Text style={styles.breadcrumbText}>
          {currentPath.replace(FileSystem.documentDirectory, '')}
        </Text>
      </View>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        style={styles.list}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setModalType('createFolder');
            setModalVisible(true);
          }}
        >
          <Ionicons name="folder" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Нова папка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setModalType('createFile');
            setModalVisible(true);
          }}
        >
          <Ionicons name="document" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Новий файл</Text>
        </TouchableOpacity>
      </View>
      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4682B4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  storageInfo: {
    marginTop: 10,
  },
  storageText: {
    color: '#fff',
    fontSize: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  breadcrumbText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemInfo: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
});