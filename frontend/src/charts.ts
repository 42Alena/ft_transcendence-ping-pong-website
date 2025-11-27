//example from
// https://www.chartjs.org/docs/latest/getting-started/usage.html

import Chart from 'chart.js/auto'

function renderSomeChart() {
	const ctx = document.getElementById('myChart') as HTMLCanvasElement;
	if (!ctx) return;

	new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
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
}

renderSomeChart();