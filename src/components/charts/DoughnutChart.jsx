import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

ChartJS.register(ArcElement, Tooltip, Legend)

function DoughnutChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.data,
      backgroundColor: data.colors,
      borderWidth: 0,
      hoverOffset: 5,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 9, padding: 10, font: { size: 10 } },
      },
    },
  }

  return (
    <Card>
      <SectionHeader title="Categorias" />
      <div className="chart-wrap-sm">
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default DoughnutChart
