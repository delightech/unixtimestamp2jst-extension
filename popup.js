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