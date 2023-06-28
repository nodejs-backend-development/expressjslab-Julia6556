const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const baseURL = 'https://gorest.co.in/public/v2';
const secretKey = 'julia1'; // ��������� ���� ��� ������ ������

// Middleware ��� �������� ��������������
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // ������� "Unauthorized", ���� ������� �����
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // ������� "Forbidden", ���� ����� �� �������
    }

    req.user = user; // �������� ���������� ��� ����������� � ���������� `user` ��'���� `req`
    next(); // ���������� ������� ��������� middleware ��� ��������
  });
}

// ������� ��������� ������������ ��� ���������� ���� ���������
const measurePerformance = (req, res, next) => {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const endTime = process.hrtime(startTime);
    const executionTime = (endTime[0] * 1e9 + endTime[1]) / 1e6; // ��� � ����������
    console.log(`Execution time: ${executionTime.toFixed(2)} ms`); // �������� ��� ��������� � �������
  });
  next();
};

// ������ middleware ��� ��� ��������
app.use(measurePerformance);

// �������� ��� ������������
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// �������� ����� �����������
app.get('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${baseURL}/users/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// �������� ������ �����������
app.post('/users', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${baseURL}/users`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// ������� ����� �����������
app.put('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.put(`${baseURL}/users/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// �������� ������� ����� �����������
app.patch('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.patch(`${baseURL}/users/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// �������� �����������
app.delete('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.delete(`${baseURL}/users/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

// �������������� �����������
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  // �������� ����� �� ������
  if (username === 'julia2' && password === 'julia3') {
    // ��������� ������ � ������������� JWT
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
  } else {
    res.sendStatus(401); // ������� "Unauthorized", ���� ���� ��� ������ ����������
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
