fetch("data/dashboard.json")
  .then(r => r.json())
  .then(data => initDashboard(data));

function initDashboard(data) {
  clock();
  setInterval(clock, 1000);

  // DAILY PROGRESS
  new Chart(dailyProgress, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Remaining"],
      datasets: [{
        data: [
          data.dailyCounting.total,
          data.metadata.dailyTarget - data.dailyCounting.total
        ],
        backgroundColor: ["#00ffcc", "#333"]
      }]
    },
    options: { cutout: "70%" }
  });

  // AREA BAR
  new Chart(areaChart, {
    type: "bar",
    data: {
      labels: data.dailyCounting.byArea.map(a => a.area),
      datasets: [{
        data: data.dailyCounting.byArea.map(a => a.qty),
        backgroundColor: "#009ffd"
      }]
    }
  });

  // WEEKLY HISTORY
  new Chart(weeklyChart, {
    type: "line",
    data: {
      labels: data.weeklyHistory.map(w => w.week),
      datasets: [{
        label: "Total",
        data: data.weeklyHistory.map(w => w.total),
        borderColor: "#00ffcc",
        tension: .4,
        fill: false
      }]
    }
  });

  // DAILY TASKS
  const completed = data.dailyTasks.filter(t => t.status === "Completed").length;
  const pending = data.dailyTasks.length - completed;

  new Chart(dailyTasksChart, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ["#00ff99", "#ff4d4d"]
      }]
    }
  });

  data.dailyTasks.forEach(t => {
    dailyTasksList.innerHTML += `<li>${t.task} – ${t.status}</li>`;
  });

  // WEEKLY TASKS
  new Chart(weeklyTasksChart, {
    type: "doughnut",
    data: {
      labels: ["Weekly Tasks"],
      datasets: [{
        data: [data.weeklyTasks.length || 1],
        backgroundColor: ["#ffaa00"]
      }]
    }
  });

  weeklyTasksList.innerHTML = "<li>No weekly tasks defined</li>";
}

function clock() {
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString();
}
