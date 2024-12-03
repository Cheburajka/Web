const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/drawFractal', (req, res) => {
  const { A, B, C } = req.body;

  // Логика для вычисления треугольника Серпинского
  const pixels = [];
  let p = [];
  let dx = Math.random();
  let dy = dx <= 0.5 ? Math.random() * dx * Math.tan(Math.PI / 3) : Math.random() * (1 - dx) * Math.tan(Math.PI / 3);
  pixels.push({ x: dx * 500, y: dy * 500 });
  p.push([dx, dy]);

  const startTime = performance.now();
  const startDate = new Date().toLocaleTimeString();

  for (let i = 0; i < 100000; i++) {
    let U = [A, B, C][Math.floor(Math.random() * 3)];
    let G = p[Math.floor(Math.random() * p.length)];
    let dxx = (U[0] + G[0]) / 2;
    let dyy = (U[1] + G[1]) / 2;
    pixels.push({ x: dxx * 500, y: dyy * 500 });
    p.push([dxx, dyy]);
  }

  const endTime = performance.now();
  const endDate = new Date().toLocaleTimeString();
  const elapsedTime = endTime - startTime;

  res.json({
    pixels,
    startDate,
    endDate,
    elapsedTime: elapsedTime.toFixed(2)
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});