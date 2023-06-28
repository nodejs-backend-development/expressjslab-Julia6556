const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const baseURL = 'https://gorest.co.in/public/v2';
const secretKey = 'julia1'; // Секретний ключ для підпису токенів

// Middleware для перевірки автентифікації
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Помилка "Unauthorized", якщо відсутній токен
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Помилка "Forbidden", якщо токен не валідний
    }

    req.user = user; // Зберігаємо інформацію про користувача у властивості `user` об'єкта `req`
    next(); // Продовжуємо обробку наступних middleware або маршрутів
  });
}

// Проміжне програмне забезпечення для вимірювання часу виконання
const measurePerformance = (req, res, next) => {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const endTime = process.hrtime(startTime);
    const executionTime = (endTime[0] * 1e9 + endTime[1]) / 1e6; // час в мілісекундах
    console.log(`Execution time: ${executionTime.toFixed(2)} ms`); // Виводимо час виконання у консоль
  });
  next();
};

// Додаємо middleware для всіх маршрутів
app.use(measurePerformance);

// Отримати всіх користувачів
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// Отримати деталі користувача
app.get('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${baseURL}/users/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// Створити нового користувача
app.post('/users', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${baseURL}/users`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// Оновити деталі користувача
app.put('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.put(`${baseURL}/users/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// Частково оновити деталі користувача
app.patch('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.patch(`${baseURL}/users/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// Видалити користувача
app.delete('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.delete(`${baseURL}/users/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// Аутентифікація користувача
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  // Перевірка логіна та пароля
  if (username === 'julia2' && password === 'julia3') {
    // Генерація токена з використанням JWT
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
  } else {
    res.sendStatus(401); // Помилка "Unauthorized", якщо логін або пароль неправильні
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
