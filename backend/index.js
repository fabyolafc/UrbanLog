const http = require('http');
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const entregasRouter = require('./routes/entregas');

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.use('/entregas', entregasRouter);

app.get('/', (req, res) => res.json({ ok: true }));

async function start() {
  await sequelize.sync();
  const server = http.createServer(app);
  server.listen(PORT);
  server.on('listening', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Use PORT=... to start on another port.`);
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
