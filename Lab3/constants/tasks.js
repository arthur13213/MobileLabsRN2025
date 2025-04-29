export const TASKS = [
  {
    id: '1',
    title: 'Зробити 10 кліків',
    description: 'Натиснути на об\'єкт 10 разів',
    completed: false,
    type: 'tap',
    target: 10,
    current: 0
  },
  {
    id: '2',
    title: 'Зробити подвійний клік 5 разів',
    description: 'Використати подвійний клік для виконання 5 натискань',
    completed: false,
    type: 'doubleTap',
    target: 5,
    current: 0
  },
  {
    id: '3',
    title: 'Утримувати об\'єкт 3 секунди',
    description: 'Використати довге натискання на об\'єкт',
    completed: false,
    type: 'longPress',
    target: 1,
    current: 0
  },
  {
    id: '4',
    title: 'Перетягнути об\'єкт',
    description: 'Перемістити об\'єкт по екрану',
    completed: false,
    type: 'pan',
    target: 1,
    current: 0
  },
  {
    id: '5',
    title: 'Зробити свайп вправо',
    description: 'Використати швидкий свайп вправо',
    completed: false,
    type: 'flingRight',
    target: 1,
    current: 0
  },
  {
    id: '6',
    title: 'Зробити свайп вліво',
    description: 'Використати швидкий свайп вліво',
    completed: false,
    type: 'flingLeft',
    target: 1,
    current: 0
  },
  {
    id: '7',
    title: 'Змінити розмір об\'єкта',
    description: 'Збільшити або зменшити об\'єкт пінчем',
    completed: false,
    type: 'pinch',
    target: 1,
    current: 0
  },
  {
    id: '8',
    title: 'Отримати 100 очок',
    description: 'Набрати загалом 100 очок у лічильнику',
    completed: false,
    type: 'score',
    target: 100,
    current: 0
  }
];