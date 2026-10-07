const financialData = {
  "2025–2026": {
    bagsPacked: 3314,
    schoolsServed: 6,

    income: {
      "Donation Income": 16148.02,
      "Fundraising Income": 5463.38
    },

    expenses: {
      "Food Purchases": 10064.53,
      "Operating Expenses": 2090.21,
      "Community Outreach": 1125.27,
      "Additional Student Support": 199.68
    }
  },

  "2024–2025": {
    bagsPacked: 3398,
    schoolsServed: 5,

    income: {
      "Donation Income": 20460.05,
      "Fundraising Income": 4623.73
    },

    expenses: {
      "Food Purchases": 16757.96,
      "Operating Expenses": 1418.75,
      "Community Outreach": 0,
      "Additional Student Support": 148.05
    }
  }
};


/*
  INCOME = shades of Cat Packs blue
*/

const incomeColors = {
  "Donation Income":
    "#303795",

  "Fundraising Income":
    "#7C80BD"
};


/*
  EXPENSES = shades of Cat Packs pink
*/

const expenseColors = {
  "Food Purchases":
    "#ED2467",

  "Operating Expenses":
    "#F05C8D",

  "Community Outreach":
    "#F48BAD",

  "Additional Student Support":
    "#F8B8CE"
};


const yearSelect =
  document.querySelector(
    "#year-select"
  );

const bagsPackedDisplay =
  document.querySelector(
    "#bags-packed"
  );

const schoolsServedDisplay =
  document.querySelector(
    "#schools-served"
  );

const incomeTotalDisplay =
  document.querySelector(
    "#income-total"
  );

const expenseTotalDisplay =
  document.querySelector(
    "#expense-total"
  );


let incomeChart;

let expenseChart;


/* --------------------
   FORMATTERS
-------------------- */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(value);

}


function formatNumber(value) {

  return new Intl.NumberFormat(
    "en-US"
  ).format(value);

}


function getTotal(object) {

  return Object.values(
    object
  ).reduce(
    (sum, value) =>
      sum + value,
    0
  );

}


/* --------------------
   YEAR DROPDOWN
-------------------- */

function populateYearDropdown() {

  const years =
    Object.keys(financialData);


  yearSelect.innerHTML = "";


  years.forEach((year) => {

    const option =
      document.createElement("option");


    option.value = year;

    option.textContent = year;


    yearSelect.appendChild(option);

  });


  yearSelect.value =
    years[0];
}


/* --------------------
   DATASETS
-------------------- */

function createDatasets(
  dataObject,
  colorObject
) {

  return Object.entries(
    dataObject
  ).map(
    ([category, value]) => {

      return {
        label:
          category,

        data:
          [value],

        backgroundColor:
          colorObject[
            category
          ] || "#cccccc",

        borderWidth:
          0,

        borderSkipped:
          false,

        borderRadius:
          4
      };

    }
  );

}


/* --------------------
   TOOLTIP
-------------------- */

function tooltipLabel(
  context
) {

  const value =
    context.parsed.x;


  const datasets =
    context.chart.data
      .datasets;


  const total =
    datasets.reduce(
      (sum, dataset) => {

        return (
          sum +
          (
            dataset.data[0] ||
            0
          )
        );

      },
      0
    );


  const percent =
    total > 0
      ? (
          value /
          total
        ) * 100
      : 0;


  return (
    `${context.dataset.label}: ` +
    `${formatCurrency(value)} ` +
    `(${percent.toFixed(1)}%)`
  );

}


/* --------------------
   COMMON CHART OPTIONS
-------------------- */

function getChartOptions() {

  return {
    responsive:
      true,

    maintainAspectRatio:
      false,

    indexAxis:
      "y",

    interaction: {
      mode:
        "nearest",

      intersect:
        true
    },


    plugins: {

      legend: {
        position:
          "bottom",

        labels: {
          usePointStyle:
            true,

          pointStyle:
            "rectRounded",

          padding:
            15,

          boxWidth:
            10,

          boxHeight:
            10,

          color:
            "#2f2e2e",

          font: {
            family:
              "Montserrat",

            size:
              11
          }
        }
      },


      tooltip: {
        backgroundColor:
          "rgba(47,46,46,0.96)",

        padding:
          11,

        displayColors:
          true,

        titleFont: {
          family:
            "Montserrat",

          size:
            12,

          weight:
            "700"
        },

        bodyFont: {
          family:
            "Montserrat",

          size:
            12
        },

        callbacks: {

          title() {
            return "";
          },


          label:
            tooltipLabel

        }
      }
    },


    scales: {

      x: {
        stacked:
          true,

        beginAtZero:
          true,

        border: {
          display:
            false
        },

        grid: {
          color:
            "rgba(0,0,0,0.06)"
        },

        ticks: {
          color:
            "#666666",

          font: {
            family:
              "Montserrat",

            size:
              10
          },

          callback(value) {

            return (
              "$" +
              Number(
                value
              ).toLocaleString()
            );

          }
        }
      },


      y: {
        stacked:
          true,

        display:
          false,

        grid: {
          display:
            false
        },

        border: {
          display:
            false
        }
      }
    }
  };

}


/* --------------------
   CREATE CHARTS
-------------------- */

function createCharts() {

  const selectedYear =
    yearSelect.value;


  const yearData =
    financialData[
      selectedYear
    ];


  incomeChart =
    new Chart(
      document.querySelector(
        "#income-chart"
      ),
      {
        type:
          "bar",

        data: {
          labels:
            [selectedYear],

          datasets:
            createDatasets(
              yearData.income,
              incomeColors
            )
        },

        options:
          getChartOptions()
      }
    );


  expenseChart =
    new Chart(
      document.querySelector(
        "#expense-chart"
      ),
      {
        type:
          "bar",

        data: {
          labels:
            [selectedYear],

          datasets:
            createDatasets(
              yearData.expenses,
              expenseColors
            )
        },

        options:
          getChartOptions()
      }
    );

}


/* --------------------
   UPDATE YEAR
-------------------- */

function updateYear() {

  const selectedYear =
    yearSelect.value;


  const yearData =
    financialData[
      selectedYear
    ];


  /*
    Update program scale.
  */

  bagsPackedDisplay.textContent =
    formatNumber(
      yearData.bagsPacked
    );


  schoolsServedDisplay.textContent =
    formatNumber(
      yearData.schoolsServed
    );


  /*
    Update annual totals.
  */

  const incomeTotal =
    getTotal(
      yearData.income
    );


  const expenseTotal =
    getTotal(
      yearData.expenses
    );


  incomeTotalDisplay.textContent =
    formatCurrency(
      incomeTotal
    );


  expenseTotalDisplay.textContent =
    formatCurrency(
      expenseTotal
    );


  /*
    Update income chart.
  */

  incomeChart.data.labels =
    [selectedYear];


  incomeChart.data.datasets =
    createDatasets(
      yearData.income,
      incomeColors
    );


  incomeChart.update();


  /*
    Update expense chart.
  */

  expenseChart.data.labels =
    [selectedYear];


  expenseChart.data.datasets =
    createDatasets(
      yearData.expenses,
      expenseColors
    );


  expenseChart.update();

}


/* --------------------
   INITIALIZE
-------------------- */

populateYearDropdown();

createCharts();

updateYear();


yearSelect.addEventListener(
  "change",
  updateYear
);
