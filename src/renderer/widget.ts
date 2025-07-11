let refreshInterval = 30; // default seconds
let countdown = refreshInterval;
let intervalId: any = null;
let countdownId: any = null;

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

async function fetchStatus() {
  console.log("Fetching SlimPay status, may god be with us")
  try {
    const res = await fetch('https://status.slimpay.com/api/v2/components.json');
    console.log(res);
    const data = await res.json();
    renderStatus(data.components);
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
  startTimers();
});