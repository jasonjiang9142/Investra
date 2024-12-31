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

  useEffect(() => {
    console.log("---")
    console.log("price progression dates", priceProgressionDates)
    console.log("price progression rois", priceProgressionRois)
  }, []);


  // Process data for Chart.js
  const chartData = {
    labels: priceProgressionDates,  // Use priceProgressionDates for X-axis
    datasets: [
      {
        label: 'Price Progression',
        data: priceProgressionRois,  // Use priceProgressionRois for Y-axis
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      {priceProgressionDates.length > 0 && priceProgressionRois.length > 0 ? (
        <div>
          <h1>Price Progression</h1>

          {/* Display as Chart */}
          <div>
            <h2>Chart of Price Progression</h2>
            <Line data={chartData} />
          </div>7866tyr
        </div>
      ) : (
        <div>
          <p>Waiting for data for the stockchart </p>
        </div>
      )}
    </div>
  );
};

export default StockChart;
