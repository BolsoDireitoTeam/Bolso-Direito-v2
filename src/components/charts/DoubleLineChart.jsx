import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import Card from '../ui/Card'
import { colors } from '../../data/constants'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

function DoubleLineChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Efetivo',
        data: data.efetivo,
        borderColor: colors.teal,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Esperado',
        data: data.esperado,
        borderColor: colors.purple, // Blue/purple-ish
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [5, 5], // optionally make expected dashed, or solid
        tension: 0.4,
      }
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#fff',
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
        }
      } 
    },
    scales: {
      y: { 
        display: true, 
        grid: { display: false }, 
        ticks: { color: '#fff' },
        border: { display: false }
      },
      x: { 
        grid: { display: false }, 
        ticks: { 
          color: '#fff',
          font: { size: 10 } 
        },
        border: { display: false }
      },
    },
  }

  return (
    <Card style={{ padding: '1rem', height: '100%' }}>
      <div className="chart-wrap-lg" style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default DoubleLineChart
