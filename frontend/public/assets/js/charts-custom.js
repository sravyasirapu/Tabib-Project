/* Chart 1 */

var chartactivity = document.getElementById('chart1').getContext("2d");

var gradientStroke = chartactivity.createLinearGradient(200, 0, 100, 0);
gradientStroke.addColorStop(0, "rgba(58, 233, 245, 1)");
gradientStroke.addColorStop(1, "rgba(18, 216, 227, 1)");

var gradientStroke2 = chartactivity.createLinearGradient(200, 0, 100, 0);
gradientStroke2.addColorStop(0, "rgba(255, 92, 203, 1)");
gradientStroke2.addColorStop(1, "rgba(253, 133, 168, 1)");

var gradientFill = chartactivity.createLinearGradient(0, 0, 0, 350);
gradientFill.addColorStop(0, "rgba(128, 182, 244, 0.5)");
gradientFill.addColorStop(1, "rgba(128, 182, 244, 0)");

var gradientFill2 = chartactivity.createLinearGradient(0, 0, 0, 350);
gradientFill2.addColorStop(0, "rgba(255, 91, 204, 0.5)");
gradientFill2.addColorStop(1, "rgba(255, 91, 204, 0)");

var ActivityChart = new Chart(chartactivity, {
    type: 'line',
    data: {
        labels: ["JAN", "FEB", "MAR", "APR", "MAY"],
        datasets: [{
            label: "Appointment",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: "rgba(255, 255, 255, 1)",
            pointHoverBackgroundColor: "rgba(128, 182, 244, 1)",
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 1,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 1,
            data: [0, 152, 80, 250, 190]
        }, {
            label: "Patients",
            borderColor: gradientStroke2,
            pointBorderColor: gradientStroke2,
            pointBackgroundColor: "rgba(255, 255, 255, 1)",
            pointHoverBackgroundColor: "rgba(128, 182, 244, 1)",
            pointHoverBorderColor: gradientStroke2,
            pointBorderWidth: 1,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: true,
            backgroundColor: gradientFill2,
            borderWidth: 1,
            data: [0, 105, 190, 140, 270]
        }]
    },
    options: {
        legend: {
            position: "top",
            labels: {
                boxWidth: 15,
                padding: 15,
                fontColor: "#96a2b4",
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#96a2b4",
                    fontStyle: "bold",
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    padding: 20
                },
                gridLines: {
                    drawTicks: false,
                    display: false
                }

            }],
            xAxes: [{
                gridLines: {
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 20,
                    fontColor: "#96a2b4",
                    fontStyle: "bold"
                }
            }]
        }
    }
});

// chart 2
var ctx = document.getElementById("chart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fr'],
        datasets: [{
            label: 'Admitted',
            data: [150, 200, 190, 190, 200, 230, 220],
            barPercentage: .5,
            backgroundColor: "#5c79c3",


        }, {
            label: 'Discharge',
            data: [190, 140, 180, 240, 160, 190, 140],
            barPercentage: .5,
            backgroundColor: "#d17656",

        }]
    },
    options: {
        maintainAspectRatio: false,

        legend: {
            display: false,
            labels: {
                fontColor: '#585757',
                boxWidth: 40,

            }
        },
        tooltips: {
            enabled: true
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: '#96a2b4'
                },
                gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0.07)"
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: '#96a2b4'
                },
                gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0.07)"
                },
            }]
        }
    }
});


// chart 3
new Chart(document.getElementById("chart3"), {
    type: 'doughnut',
    data: {
        labels: ["Stroke", "Diabetes", "Cirrhosis", "Tuberculosis"],
        datasets: [{
            label: "Top Diseases (millions)",
            backgroundColor: ["rgba(115, 90, 132, 1)", "rgba(231, 100, 18, 1)", "rgba(155, 195, 17, 1)", "rgba(78, 152, 217, 1)"],
            // data: [2478, 5267, 734, 784],
            data: [1, 2, 1, 5]
        }]
    },
    options: {
        legend: {
            display: false,
            position: "left",

        },
        maintainAspectRatio: false,
        title: {
            display: false,
            text: 'Top Diseases'
        }
    }
});