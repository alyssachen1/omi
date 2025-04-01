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
    .filter(i => i && i.date && i.dominantColor)
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
        
        if (!chartArea || sortedInteractions.length < 2) {
          return colorMap[sortedInteractions[0].dominantColor] || colorMap.Gray;
        }

        try {
          const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          
          if (sortedInteractions.length === 1) {
            const color = colorMap[sortedInteractions[0].dominantColor] || colorMap.Gray;
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color);
            return gradient;
          }

          sortedInteractions.forEach((interaction, index) => {
            const position = index / (sortedInteractions.length - 1);
            const color = colorMap[interaction.dominantColor] || colorMap.Gray;
            gradient.addColorStop(position, color);
          });
          
          return gradient;
        } catch (error) {
          console.warn('Gradient creation failed:', error);
          return colorMap[sortedInteractions[0].dominantColor] || colorMap.Gray;
        }
      },
      backgroundColor: sortedInteractions.map(i => 
        colorMap[i.dominantColor] || colorMap.Gray
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
        min: sortedInteractions[0].date,
        offset: true,
        ticks: {
          padding: 10
        },
        grid: {
          offset: true
        },
        bounds: 'ticks',
        padding: {
          left: 20,
          right: 20
        }
      },
      y: {
        title: {
          display: true,
          text: 'Words per Interaction'
        },
        beginAtZero: true
      }
    },
    layout: {
      padding: {
        left: 20,
        right: 20
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
              `Dominant Color: ${interaction.dominantColor || 'Not specified'}`
            ];
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
}; 