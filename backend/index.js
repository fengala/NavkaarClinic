import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { PORT, mongodbURL } from './config.js';
import { fileURLToPath } from 'url';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import timeslotRoutes from './routes/timeslotRoutes.js';
import cors from 'cors';

const app = express();
// const PORT = process.env.PORT || 5555;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//routes
app.use("/api/v1/user", userRoutes);
app.use('/api/timeslots', timeslotRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
