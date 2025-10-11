<template>
  <div class="chart-container">
    <canvas :id="chartId" ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  data: number[]
  label?: string
  backgroundColor?: string | string[]
  chartId?: string
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Data',
  backgroundColor: '#0066CC',
  chartId: 'bar-chart',
  horizontal: false
})

const canvasRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const createChart = () => {
  if (!canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.label,
          data: props.data,
          backgroundColor: props.backgroundColor,
          borderColor: Array.isArray(props.backgroundColor)
            ? props.backgroundColor
            : props.backgroundColor,
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: props.horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
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
