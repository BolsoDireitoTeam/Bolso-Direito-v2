import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import { colors } from '../../data/constants'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function BarChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'Despesas',
      data: data.data,
      backgroundColor: colors.purple,
      borderRadius: 8,
      barPercentage: 0.6,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, display: false, grid: { display: false } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  }

  return (
    <Card>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="section-title">Despesas por Mês</span>
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm px-2 py-1 active"
            style={{
              fontSize: '0.72rem',
              background: 'rgba(78,227,196,0.12)',
              color: 'var(--bd-teal)',
              border: '1px solid rgba(78,227,196,0.25)',
              borderRadius: '8px',
            }}
          >
            2025
          </button>
          <button
            className="btn btn-sm px-2 py-1"
            style={{
              fontSize: '0.72rem',
              background: 'transparent',
              color: 'var(--bd-muted)',
              border: '1px solid var(--bd-border)',
              borderRadius: '8px',
            }}
          >
            2024
          </button>
        </div>
      </div>
      <div className="chart-wrap">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default BarChart
