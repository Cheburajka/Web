<template>
  <div>
    <h1>Треугольник Серпинского</h1>
    <div>
      <br>
      <svg :width="w" :height="h">
        <rect v-for="(pixel, index) in pixels" 
          :key="index"
          fill="#000000" 
          fill-opacity="1" 
          :x="pixel.x" 
          :y="pixel.y" 
          width="1" 
          height="1"/>
      </svg>
      <br>
      <label>Вершина A (x, y):</label>
      <input type="number" v-model="A[0]">
      <input type="number" v-model="A[1]">
      <br>
      <label>Вершина B (x, y):</label>
      <input type="number" v-model="B[0]">
      <input type="number" v-model="B[1]">
      <br>
      <label>Вершина C (x, y):</label>
      <input type="number" v-model="C[0]">
      <input type="number" v-model="C[1]">
      <br>
      <button @click="drawFractal">Перерисовать фрактал</button>
      <div id="time"></div>
    </div>

    <canvas id="performanceChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      w: 500,
      h: 500,
      A: [0, 0],
      B: [0.5, 0.86603], // Math.Sqrt(3)/2 = 0.86603
      C: [1, 0],
      pixels: [],
      chart: null,
    };
  },
  computed: {
    ABC() {
      return [this.A, this.B, this.C];
    }
  },
  methods: {
    async drawFractal() {
      const response = await fetch('http://localhost:3000/api/drawFractal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          A: this.A,
          B: this.B,
          C: this.C
        })
      });

      const data = await response.json();
      this.pixels = data.pixels;

      document.getElementById('time').innerHTML = `
        <p>Время начала построения: ${data.startDate}</p>
        <p>Время окончания построения: ${data.endDate}</p>
        <p>Время построения: ${data.elapsedTime} мс</p>
      `;

      this.updateChart([1000000], [data.elapsedTime]);
    },
    updateChart(labels, data) {
      if (!this.chart) {
        var canvasElement = document.getElementById('performanceChart');
        console.log('Canvas element:', canvasElement); // Добавьте этот лог
        var ctx = canvasElement.getContext('2d');
        console.log('Canvas context:', ctx); // Добавьте этот лог
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Время выполнения (мс)',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } else {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    }
  },
  created() {
    let now = new Date();
    console.log("Начато построение: " + now + " мс: " + now.getMilliseconds());
    this.drawFractal();
  },
  mounted() {
    let now = new Date();
    console.log("Отображено на странице: " + now + " мс: " + now.getMilliseconds());
  },
};
</script>

<style scoped>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
svg {
  border: 1px solid #000000;
}
input {
  width: 60px;
}
#time {
  font-size: 18px;
  margin-top: 20px;
}
</style>