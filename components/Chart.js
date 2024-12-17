import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MoodPieChart({ data }) {
  // Prepare the mood count data for the pie chart
  const moodCounts = {
    Sad: 0,
    Existing: 0,
    Good: 0,
    Elated: 0,
    '&*@#$': 0, // Handle unknown moods
  };

  Object.values(data).forEach((yearData) => {
    Object.values(yearData).forEach((monthData) => {
      Object.values(monthData).forEach((dayData) => {
        if (dayData in moodCounts) {
          moodCounts[dayData]++;
        }
      });
    });
  });

  const pieData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: 'Mood Distribution',
        data: Object.values(moodCounts),
        backgroundColor: ['#FF9999', '#66B3FF', '#99FF99', '#FFCC99', '#FFD700'], // Customize the colors as needed
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} days`;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <h3 className="text-center">Mood Distribution</h3>
      <Pie data={pieData} options={options} />
    </div>
  );
}
