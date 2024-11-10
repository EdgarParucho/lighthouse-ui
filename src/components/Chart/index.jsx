import { useEffect, useState } from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart, RadialLinearScale } from 'chart.js/auto'
import './chart.css'

Chart.register(RadialLinearScale)

const AreaChart = ({ habits, records, daysElapsed }) => {
  const datasetConfig = {
    label: 'Frequency',
    fill: true,
    backgroundColor: 'rgba(40, 40, 40, .3)',
    borderColor: '#070707',
    pointBackgroundColor: '#E0E0E0',
    pointBorderColor: '#070707',
    pointHoverBackgroundColor: 'rgb(40, 40, 40)',
  }

  const [data, setData] = useState({
    labels: habits.map(habit => habit.name),
    datasets: [{ ...datasetConfig, data: [] }]
  })

  const options = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 7,
        pointLabels: { font: { size: 12 } }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  function getHabitRecordFrequency(habit) {
    const habitRecords = records.filter(r => r.habitID == habit.id).length
    const WEEK_DAYS = 7
    return Math.round((habitRecords / daysElapsed) * WEEK_DAYS)
  }

  useEffect(() => {
    const frequencies = []
    const habitNames = habits.map(habit => habit.name)
    habits.forEach(habit => frequencies.push(getHabitRecordFrequency(habit)))
    setData({
      labels: habitNames,
      datasets: [{
        ...datasetConfig,
        data: frequencies,
      }]
    })
  }, [habits, records])

  return <div className='chart-container'>
    <h2 className='subtitle'>Weekly Frequency</h2>
    <Radar data={data} options={options} />
  </div>
}

export default AreaChart