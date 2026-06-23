import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import { colors } from '../../data/constants'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

function RadarChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Atual',
        data: data.atual,
        borderColor: colors.teal,
        backgroundColor: 'rgba(78,227,196,0.12)',
        borderWidth: 2,
        pointBackgroundColor: colors.teal,
        pointRadius: 4,
      },
      {
        label: 'Meta',
        data: data.meta,
        borderColor: colors.purple,
        backgroundColor: 'rgba(172,182,229,0.07)',
        borderWidth: 1.5,
        borderDash: [4, 3],
        pointBackgroundColor: colors.purple,
        pointRadius: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, padding: 10, font: { size: 10 } },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const isMeta = context.datasetIndex === 1;
            const absValue = isMeta ? data.metaAbs[context.dataIndex] : data.atualAbs[context.dataIndex];
            const formattedCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(absValue || 0);
            return `${context.dataset.label}: ${context.raw}% (${formattedCurrency})`;
          }
        }
      }
    },
    scales: {
      r: {
        grid: { color: 'rgba(255,255,255,0.06)' },
        ticks: { display: false },
        pointLabels: { font: { size: 10 }, color: '#8a9bbf' },
      },
    },
  }

  return (
    <Card>
      <SectionHeader title="Perfil de Gastos" />
      <div className="chart-wrap" style={{ height: '400px' }}>
        <Radar data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default RadarChart
