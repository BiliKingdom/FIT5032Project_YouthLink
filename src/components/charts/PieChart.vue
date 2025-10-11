<template>
  <div class="chart-container">
    <canvas :id="chartId" ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(PieController, ArcElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  data: number[]
  colors?: string[]
  chartId?: string
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => [
    '#0066CC',
    '#28a745',
    '#ffc107',
    '#dc3545',
    '#6c757d',
    '#17a2b8',
    '#6f42c1',
    '#fd7e14'
  ],
  chartId: 'pie-chart'
})

const canvasRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const createChart = () => {
  if (!canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(canvasRef.value, {
    type: 'pie',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: props.colors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || ''
              const value = context.parsed || 0
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(
  () => [props.labels, props.data],
  () => {
    createChart()
  },
  { deep: true }
)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
