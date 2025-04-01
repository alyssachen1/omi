'use client'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export const TimelineChart = ({ person }) => {
  const colorMap = {
    'Yellow': 'rgba(255, 206, 86, 0.5)',
    'Blue': 'rgba(54, 162, 235, 0.5)',
    'Red': 'rgba(255, 99, 132, 0.5)',
    'Green': 'rgba(75, 192, 192, 0.5)',
    'Orange': 'rgba(255, 198, 140, 1)',
    'Gray': 'rgba(200, 200, 200, 1)',
    'Black': 'rgba(0, 0, 0, 0.5)',
    'Pink': 'rgba(255, 182, 193, 0.5)',
    'Purple': 'rgba(147, 112, 219, 0.5)',
    'White': 'rgba(255, 255, 255, 0.5)'
  };

  if (!person?.interactions?.length) {
    return <div>No interaction data available</div>;
  }

  const sortedInteractions = [...person.interactions]
    .filter(i => i && i.date && (i.wordCount !== undefined))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (sortedInteractions.length === 0) {
    return <div>No valid interaction data available</div>;
  }

  const data = {
    labels: sortedInteractions.map(i => i.date),
    datasets: [{
      data: sortedInteractions.map(i => i.wordCount),
      borderColor: function(context) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        
        if (!chartArea) return colorMap[person.suggested_color];

        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        
        if (sortedInteractions.length === 1) {
          const color = colorMap[sortedInteractions[0].dominantColor] || colorMap[person.suggested_color];
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color);
        } else {
          sortedInteractions.forEach((interaction, index) => {
            gradient.addColorStop(
              index / (sortedInteractions.length - 1),
              colorMap[interaction.dominantColor] || colorMap[person.suggested_color]
            );
          });
        }
        
        return gradient;
      },
      backgroundColor: sortedInteractions.map(i => 
        colorMap[i.dominantColor] || colorMap[person.suggested_color]
      ),
      pointRadius: 8,
      pointHoverRadius: 12,
      pointBorderWidth: 0,
      pointStyle: 'circle',
      tension: 0.4,
    }]
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        offset: true,
        ticks: {
          padding: 10
        },
        grid: {
          offset: true
        },
        bounds: 'ticks',
        padding: {
          left: 50
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Words per Interaction'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const interaction = sortedInteractions[context.dataIndex];
            return [
              `Date: ${interaction.date}`,
              `Words: ${interaction.wordCount}`,
              `Dominant Color: ${interaction.dominantColor || person.suggested_color}`
            ];
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
}; 