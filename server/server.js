const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {connectDB} = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

const organizationRoutes = require('./routes/organizationRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', userRoutes);
app.use('/api/organization', organizationRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});