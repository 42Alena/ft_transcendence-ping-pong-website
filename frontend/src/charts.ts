

import Chart from 'chart.js/auto'

const dataPie = {
  labels: [
    'wins',
    'loses',
  ],
  datasets: [{
    label: 'Wins %',
    data: [65, 35],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
    ],
    hoverOffset: 4
  }]
};

	const pie = document.getElementById('pieChart') as HTMLCanvasElement;
	new Chart(pie, {
		type: 'pie',
		data: dataPie,
		options: {
            parsing: false,
            normalized: true,
            animation: false
        }
	});

const dataLine = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
  datasets: [{
    label: 'Daily Progress',
    data: [1, 2, 4, 5, 6, 8, 10], 
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1 
  }]
};

const line = document.getElementById('lineChart') as HTMLCanvasElement;
new Chart(line, {
  type: 'line',
  data: dataLine,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 12,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Number of Wins'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Days'
        }
      }
    },
	animation: false,
  }
});

const bar = document.getElementById('barChart') as HTMLCanvasElement;

const dataBar = {
  labels: ["Jan", "Feb", "Mar", "April", "May"],
  datasets: [
    {
      label: 'Wins',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    },
    {
      label: 'Losses',
      data: [40, 45, 30, 20, 25], 
      backgroundColor: 'rgba(255, 99, 132, 0.6)', 
      borderColor: 'rgb(255, 99, 132)', 
      borderWidth: 1
    }
  ]
};

new Chart(bar, {
  type: 'bar',
  data: dataBar,
  options: {
    responsive: true, 
    scales: {
      y: {
        beginAtZero: true, 
        stacked: true 
      },
      x: {
        stacked: true 
      }
    },
    animation: false 
  }
});
