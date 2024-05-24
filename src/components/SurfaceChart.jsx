import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const SurfaceChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.distance),
    datasets: [
      {
        label: 'Elevation',
        data: data.map((d) => d.elevation),
        borderColor: 'blue',
        backgroundColor: 'lightblue',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Distance (km)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Elevation (m)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const surface = data[context.dataIndex].surface;
            return `Elevation: ${context.raw}m, Surface: ${surface}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SurfaceChart;