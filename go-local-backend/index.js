const dotenv=require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const connectDB = require('./databaselogic/db');
app.use(express.json());
const cors = require('cors');
app.use(cors());
//connect to database
connectDB();

const taskRoutes = require('./Routing/taskRoutes');

const riderRoute = require('./Routing/riderRouting');
const shopRoute = require('./Routing/shopRouting');
const userRoute = require('./Routing/userRouting');

 app.use('/user1', userRoute);
 app.use('/rider1',riderRoute);
 app.use('/shop1', shopRoute);
 app.use('/api/tasks', taskRoutes);


const PORT = process.env.PORT;



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));