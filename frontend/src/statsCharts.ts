

import Chart from 'chart.js/auto';


//_____________Alena____________________start
// Make functions available globally
declare global {
  interface Window {
    createPieChart: typeof createPieChart;
    createBarChart: typeof createBarChart;
  }
}


(window as any).createPieChart = createPieChart;
(window as any).createBarChart = createBarChart;

//to fix add a function to destroy old chart before showing new:

export function destroyExistingChart(canvas: HTMLCanvasElement) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
}

// // and call it before creating new like

//   destroyExistingChart(pie);
//   new Chart(pie, {

//_____________Alena____________________end

const pie = document.getElementById('pieChart') as HTMLCanvasElement;
const bar = document.getElementById('barChart') as HTMLCanvasElement;

export function createPieChart(wins: string, loses: string) {
  const winsNum = Number(wins);
  const losesNum = Number(loses);

  const dataPie = {
    labels: ['wins', 'loses'],
    datasets: [{
      label: 'Wins and loses percentage',
      data: [winsNum, losesNum], // Use numbers here
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 4
    }]
  };

 
destroyExistingChart(pie); // ALENA: destroy old chart before creating new

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
}

export function createBarChart(first : string, second : string, third : string)
{
  const dataBar = {
  labels: ["1st place", "2nd place", "3rd place"],
  datasets: [
    {
      label: 'Wins',
      data: [first, second, third],
     backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)'
      ],
      borderWidth: 1
    },
  ]
};

 
destroyExistingChart(bar); // ALENA: destroy old chart before creating new

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
}


