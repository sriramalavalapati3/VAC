const express = require('express');
const app = express();
const connectDB = require('./db/db');
const routes = require('./routes/routes');
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', routes);
app.listen(PORT, async() => {
    try {
         await connectDB();
         console.log(`Server is running on port ${PORT}`);
    } catch (error) {
         console.error('Error starting server:', error);    
    }
});