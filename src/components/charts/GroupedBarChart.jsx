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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function GroupedBarChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Receitas',
        data: data.receitas,
        backgroundColor: 'rgba(78,227,160,0.75)',
        borderRadius: 6,
        barPercentage: 0.7,
      },
      {
        label: 'Despesas',
        data: data.despesas,
        backgroundColor: 'rgba(240,106,106,0.75)',
        borderRadius: 6,
        barPercentage: 0.7,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 10, padding: 14, font: { size: 11 } },
      },
    },
    scales: {
      y: { beginAtZero: true, display: false, grid: { display: false } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  }

  return (
    <Card>
      <SectionHeader
        title="Receitas vs Despesas"
        linkText="Relatório"
        linkIcon="bi-arrow-right"
      />
      <div className="chart-wrap-lg">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default GroupedBarChart
