import React, { useEffect, useState } from 'react';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ priceProgressionDates, priceProgressionRois }) => {

  // Process data for Chart.js
  const chartData = {
    labels: priceProgressionDates,  // Use priceProgressionDates for X-axis
    datasets: [
      {
        label: 'ROI',  // Label for the line
        data: priceProgressionRois,  // Use priceProgressionRois for Y-axis
        borderColor: '#037b66',  // Line color
        backgroundColor: '#037b66',  // Fill color under the curve
        fill: false,  // Fill the area under the curve
        pointRadius: 0,  // Radius of points on the line
        pointHoverRadius: 1,  // Hover effect for points
        tension: 0,  // Smoothing of the line
      },
    ],
  };

  // Chart options for better design
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Stock Price Progression',
        font: {
          size: 18,
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxTicksLimit: 20,  // Limit the number of ticks to 10 to prevent crowding
          autoSkip: true,  // Auto-skip labels to avoid overlapping
        },
      },
      y: {
        title: {
          display: true,
          text: 'Return on Investment',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="px-4 py-2">
      {priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
        <div>
          <div className="relative w-10/12 mx-auto">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500">Waiting for data for the stock chart...</p>
        </div>
      )}
    </div>
  );
};

export default StockChart;
