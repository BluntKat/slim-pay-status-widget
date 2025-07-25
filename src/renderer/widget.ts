let refreshInterval = 30; // default seconds
let countdown = refreshInterval;
let intervalId: any = null;
let countdownId: any = null;
let mode : "component-view" | "overall-view" = "component-view";
let clearOnNextRefresh = false;

function startTimers() {
  console.log("Starting timers")
  clearInterval(intervalId);
  clearInterval(countdownId);
  countdown = refreshInterval;

  intervalId = setInterval(() => {
    fetchStatus();
    countdown = refreshInterval;
  }, refreshInterval * 1000);

  countdownId = setInterval(() => {
    countdown--;
    const cd = document.getElementById("countdown");
    if (cd) cd.textContent = `Next update in: ${countdown}s`;
  }, 1000);
}

function setupRefreshControl() {
  const select = document.getElementById("refresh-interval") as HTMLSelectElement;
  select.addEventListener("change", () => {
    refreshInterval = parseInt(select.value);
    console.log("Timeout has changed, gogogo")
    console.log(refreshInterval);
    startTimers();
  });
}

function setupModeControl(){
    const select = document.getElementById("mode-control") as HTMLSelectElement;
    select.addEventListener("change", () => {
    console.log(select.value);
    mode = select.value === "overall-view" ? "overall-view" : "component-view";
    console.log("View mode changed to : " + mode);
    clearOnNextRefresh = true;
    fetchStatus();
  });
}

async function fetchStatus() {
  console.log("Fetching SlimPay status, may god be with us")
  try {
    const res = mode == "component-view" ? await fetch('https://status.slimpay.com/api/v2/components.json') : await fetch(' https://status.slimpay.com/api/v2/status.json');
    console.log(res);
    const data = await res.json();
    if (mode === 'component-view'){
      renderStatus(data.components);
    }
    else {
      renderOverallStatus(data);
    }
    //Refresh maintenance status
    const maintenances = await (await fetch ('https://status.slimpay.com/api/v2/scheduled-maintenances/upcoming.json')).json();
    if (!!maintenances){
      renderMaintenances(maintenances);
    }
  } catch (error) {
    console.error("Failed to fetch status:", error);
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'operational': return 'status-ok';
    case 'degraded_performance':
    case 'partial_outage': return 'status-degraded';
    case 'major_outage': return 'status-down';
    default: return '';
  }
}

function renderStatus(components: any[]) {
  const list = document.getElementById('status-list');
  if (!list) return;

  list.innerHTML = '';

  if (clearOnNextRefresh){
    clearOverallData();
  } 

  const seen = new Set<string>();
  components.forEach(component => {
    if (seen.has(component.name)) return;
    seen.add(component.name);

    const item = document.createElement('div');
    item.className = 'status-item';

    const name = document.createElement('span');
    name.className = 'status-name';
    name.textContent = component.name;

    const dot = document.createElement('div');
    dot.className = `status-dot ${getStatusClass(component.status)}`;

    item.appendChild(name);
    item.appendChild(dot);
    list.appendChild(item);
  });
}
function renderOverallStatus(data: any) {
  const list = document.getElementById('status-list');
  if (!list) return;

  list.innerHTML = '';

  console.log(data);
  if (clearOnNextRefresh) {
    clearComponentData();
  }
  let item = document.createElement("div");
  let status = document.createElement("div");
  item.className = "overall-view";
  status.className = "overall-view-description"
  status.textContent = data.status.description;
  const dot = document.createElement('div');
  dot.className = `status-dot ${getOverallStatusClass(data.status.indicator)}`;
  dot.title = "Problem level : " + data.status.indicator;
  status.appendChild(dot);
  item.appendChild(status);
  list.appendChild(item);
}



//ACTION BUTTONS HANDLING
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM LOADED MY FRIEND, LET ME IIIIN")

  const minimizeBtn = document.getElementById('minimize');
  const closeBtn = document.getElementById('close');

  minimizeBtn?.addEventListener('click', () => {
      window.api.minimize();
  });

  closeBtn?.addEventListener('click', () => {
    window.api.close();
  });

  fetchStatus();
  setupRefreshControl();
  setupModeControl();
  startTimers();
});

function clearComponentData(){
  let statusItems = document.getElementsByClassName("status-item");
  Array.from(statusItems).forEach(el => {
    el.remove();
  })
}
function clearOverallData(){
  let statusItem = document.getElementsByClassName("overall-view");
  Array.from(statusItem).forEach(el => {
    el.remove();
  })
}

function getOverallStatusClass(status : string){
  switch (status) {
    case "none" : return "green";
    case "minor" : return "yellow";
    case "major" : return "red";
    default: return "green";
  }
}

function renderMaintenances(obj: any) {
  console.log(obj);
  const list = document.getElementById('maintenance-list');
  if (!list) return;

  // Remove all child elements
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  if (obj.scheduled_maintenances.length === 0) {
    const el = document.createElement('li');
    el.textContent = "No scheduled maintenances";
    list.appendChild(el);
  } else {
    obj.scheduled_maintenances.forEach((maintenance: any) => {
      const el = document.createElement('li');
      el.className = "maintenance-item";
      el.innerHTML = `<strong>${maintenance.title}</strong> - ${maintenance.description} <br> <span class="maintenance-time">Scheduled for: ${new Date(maintenance.start_at).toLocaleString()} to ${new Date(maintenance.end_at).toLocaleString()}</span>`;
      list.appendChild(el);
    });
  }
}