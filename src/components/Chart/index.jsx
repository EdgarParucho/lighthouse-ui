import { useEffect, useState } from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart, RadialLinearScale } from 'chart.js/auto'
import dateUtils from '../../utils/dateUtils'
import './chart.css'

Chart.register(RadialLinearScale)

const AreaChart = ({ habits, records }) => {
  const datasetConfig = {
    label: 'Frequency',
    fill: true,
    backgroundColor: 'rgba(40, 40, 40, 0.2)',
    borderColor: 'rgb(40, 40, 40)',
    pointBackgroundColor: 'rgb(225, 225, 225)',
    pointBorderColor: 'rgb(40, 40, 40)',
    pointHoverBackgroundColor: 'rgb(40, 40, 40)',
  }

  const [data, setData] = useState({
    labels: habits.map(habit => habit.name),
    datasets: [{ ...datasetConfig, data: [] }]
  })

  const options = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 7
      }
    }
  }

  function getHabitRecordFrequency(habit) {
    const habitRecords = records.filter(r => r.habitID == habit.id).length
    const [, , date] = dateUtils.isoDate.split('-').map(Number)
    const WEEK_DAYS = 7
    return Math.round((habitRecords / date) * WEEK_DAYS)
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
    <h2 className='subtitle'>Compliance</h2>
    <Radar data={data} options={options} />
  </div>
}

export default AreaChart