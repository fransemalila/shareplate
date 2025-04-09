import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'SharePlate API is running!' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
}); 