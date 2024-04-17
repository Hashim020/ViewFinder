import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/posts-by-month')
      .then(response => {
        setPostData(response.data);
      })
      .catch(error => {
        console.error('Error fetching post data:', error);
      });
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    if (postData.length === 0) {
      return; // Exit if postData is empty
    }

    const aggregatedData = aggregateDataByMonth(postData);
    const monthCounts = Array.from({ length: 12 }, (_, index) => aggregatedData[index + 1] || 0);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Number of Posts',
          data: monthCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [postData]);

  const aggregateDataByMonth = (data) => {
    const aggregatedData = {};
    data.forEach(item => {
      aggregatedData[item._id] = item.count;
    });
    return aggregatedData;
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChart;
