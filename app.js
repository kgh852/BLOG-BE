const express = require('express');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { initializeSocket } = require('./services/socketService');
const chatRoutes = require('./routes/chatRoutes');
const { swaggerUi, specs } = require("./swagger");

const http = require('http')
const cors = require('cors')
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/user', authRoutes);
app.use('/posts', postRoutes); 
app.use('/api/chat', chatRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const server = http.createServer(app);
initializeSocket(server);

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
