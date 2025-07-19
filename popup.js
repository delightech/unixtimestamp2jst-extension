// Toggle button functionality
const toggleButton = document.getElementById('toggleButton');
let isEnabled = true;

toggleButton.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  chrome.tabs.sendMessage(tab.id, {action: 'toggle'}, response => {
    if (response && response.status !== undefined) {
      isEnabled = response.status;
      updateToggleButton();
    }
  });
});

function updateToggleButton() {
  if (isEnabled) {
    toggleButton.textContent = '表示: ON';
    toggleButton.classList.remove('off');
  } else {
    toggleButton.textContent = '表示: OFF';
    toggleButton.classList.add('off');
  }
}

// Manual converter
const timestampInput = document.getElementById('timestampInput');
const resultDiv = document.getElementById('result');

timestampInput.addEventListener('input', () => {
  const value = timestampInput.value.trim();
  
  if (value === '') {
    resultDiv.style.display = 'none';
    return;
  }
  
  if (/^\d{10}$/.test(value) || /^\d{13}$/.test(value)) {
    const timestamp = parseInt(value);
    let date;
    
    if (value.length === 10) {
      date = new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    const options = {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    const jstTime = date.toLocaleString('ja-JP', options);
    resultDiv.textContent = `JST: ${jstTime}`;
    resultDiv.style.display = 'block';
  } else {
    resultDiv.textContent = '有効な10桁または13桁のタイムスタンプを入力してください';
    resultDiv.style.display = 'block';
  }
});

// JST to Unix timestamp converter
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const daySelect = document.getElementById('daySelect');
const hourSelect = document.getElementById('hourSelect');
const minuteSelect = document.getElementById('minuteSelect');
const convertButton = document.getElementById('convertToUnixButton');
const jstToUnixResult = document.getElementById('jstToUnixResult');

// Initialize date/time selectors with current JST time
function initializeDateTimeSelectors() {
  const now = new Date();
  const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  
  // Populate year select (current year - 10 to current year + 10)
  const currentYear = jstNow.getFullYear();
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    if (year === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }
  
  // Populate month select
  for (let month = 1; month <= 12; month++) {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month.toString().padStart(2, '0');
    if (month === jstNow.getMonth() + 1) option.selected = true;
    monthSelect.appendChild(option);
  }
  
  // Populate day select
  updateDaySelect();
  daySelect.value = jstNow.getDate();
  
  // Populate hour select
  for (let hour = 0; hour < 24; hour++) {
    const option = document.createElement('option');
    option.value = hour;
    option.textContent = hour.toString().padStart(2, '0');
    if (hour === jstNow.getHours()) option.selected = true;
    hourSelect.appendChild(option);
  }
  
  // Populate minute select
  for (let minute = 0; minute < 60; minute++) {
    const option = document.createElement('option');
    option.value = minute;
    option.textContent = minute.toString().padStart(2, '0');
    if (minute === jstNow.getMinutes()) option.selected = true;
    minuteSelect.appendChild(option);
  }
}

// Update day select based on selected year and month
function updateDaySelect() {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const daysInMonth = new Date(year, month, 0).getDate();
  const currentDay = parseInt(daySelect.value) || 1;
  
  daySelect.innerHTML = '';
  for (let day = 1; day <= daysInMonth; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = day.toString().padStart(2, '0');
    if (day === currentDay && day <= daysInMonth) option.selected = true;
    daySelect.appendChild(option);
  }
}

// Update days when year or month changes
yearSelect.addEventListener('change', updateDaySelect);
monthSelect.addEventListener('change', updateDaySelect);

// Convert JST to Unix timestamp
convertButton.addEventListener('click', () => {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value) - 1; // JavaScript months are 0-indexed
  const day = parseInt(daySelect.value);
  const hour = parseInt(hourSelect.value);
  const minute = parseInt(minuteSelect.value);
  
  // Create date in JST
  const jstDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+09:00`;
  const jstDate = new Date(jstDateStr);
  
  // Get Unix timestamp (seconds)
  const unixTimestamp = Math.floor(jstDate.getTime() / 1000);
  
  // Display result
  jstToUnixResult.innerHTML = `
    <strong>Unix タイムスタンプ (秒):</strong> ${unixTimestamp}<br>
    <strong>Unix タイムスタンプ (ミリ秒):</strong> ${unixTimestamp * 1000}<br>
    <small style="color: #666;">JST: ${year}/${(month + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00</small>
  `;
  jstToUnixResult.style.display = 'block';
});

// Initialize on load
initializeDateTimeSelectors();