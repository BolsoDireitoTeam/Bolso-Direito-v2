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
import SectionHeader from '../ui/SectionHeader'
import { colors } from '../../data/mockData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

function LineChart({ data, title = "Saldo Acumulado" }) {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'Saldo',
      data: data.data,
      borderColor: colors.teal,
      backgroundColor: 'rgba(78,227,196,0.08)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: colors.teal,
      fill: true,
      tension: 0.4,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false, grid: { display: false } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    },
  }

  return (
    <Card>
      <SectionHeader title={title} />
      <div className="chart-wrap-sm">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default LineChart
