

import Chart from 'chart.js/auto'

const dataPie = {
  labels: [
    'wins',
    'loses',
  ],
  datasets: [{
    label: 'Wins %',
    data: [51, 49],
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
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
        }
	});

const bar = document.getElementById('barChart') as HTMLCanvasElement;

const dataBar = {
  labels: ["01.12", "02.12", "03.12", "04.12", "05.12", "06.12", "07.12"],
  datasets: [
    {
      label: 'Wins',
      data: [3, 0, 4, 2, 5, 1, 6],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    },
    {
      label: 'Losses',
      data: [2, 4, 1, 9, 1, 0, 5], 
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
    animation: false ,
        maintainAspectRatio: false,
        aspectRatio: 1,
  }
});
