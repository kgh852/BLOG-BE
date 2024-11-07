const express = require('express');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/user', authRoutes);
app.use('/posts', postRoutes);  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
