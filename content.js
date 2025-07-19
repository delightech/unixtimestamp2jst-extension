// Unix timestamp regex patterns
const timestampPatterns = [
  /\b1[0-9]{9}\b/g,     // 10-digit timestamps (seconds)
  /\b1[0-9]{12}\b/g     // 13-digit timestamps (milliseconds)
];

// Global state for timestamp display
let showTimestamps = true;

// Function to convert Unix timestamp to JST
function unixToJST(timestamp) {
  let date;
  if (timestamp.toString().length === 10) {
    date = new Date(timestamp * 1000);
  } else if (timestamp.toString().length === 13) {
    date = new Date(parseInt(timestamp));
  } else {
    return null;
  }
  
  // Format to JST (UTC+9)
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
  
  return date.toLocaleString('ja-JP', options);
}

// Set to track processed nodes
const processedNodes = new WeakSet();

// Function to process text nodes
function processTextNode(textNode) {
  if (processedNodes.has(textNode) || !textNode.parentNode || !showTimestamps) {
    return;
  }
  
  const text = textNode.textContent;
  let hasTimestamp = false;
  
  // Check if text contains timestamps
  for (const pattern of timestampPatterns) {
    if (pattern.test(text)) {
      hasTimestamp = true;
      break;
    }
  }
  
  if (!hasTimestamp) {
    return;
  }
  
  // Create a document fragment to hold new nodes
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let currentText = text;
  
  // Process all timestamps in the text
  for (const pattern of timestampPatterns) {
    const regex = new RegExp(pattern.source, 'g');
    let match;
    const matches = [];
    
    while ((match = regex.exec(currentText)) !== null) {
      matches.push({
        index: match.index,
        value: match[0]
      });
    }
    
    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);
    
    for (const matchInfo of matches) {
      const jstTime = unixToJST(matchInfo.value);
      if (!jstTime) continue;
      
      // Add text before the match
      if (matchInfo.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(currentText.substring(lastIndex, matchInfo.index))
        );
      }
      
      // Create timestamp element
      const wrapper = document.createElement('span');
      wrapper.className = 'unix-timestamp-converter';
      wrapper.setAttribute('data-original-text', matchInfo.value);
      
      const originalSpan = document.createElement('span');
      originalSpan.className = 'original-timestamp';
      originalSpan.textContent = matchInfo.value;
      
      const jstSpan = document.createElement('span');
      jstSpan.className = 'jst-time';
      jstSpan.setAttribute('title', `Unix: ${matchInfo.value}`);
      jstSpan.textContent = jstTime;
      
      wrapper.appendChild(originalSpan);
      wrapper.appendChild(jstSpan);
      fragment.appendChild(wrapper);
      
      lastIndex = matchInfo.index + matchInfo.value.length;
    }
  }
  
  // Add remaining text
  if (lastIndex < currentText.length) {
    fragment.appendChild(
      document.createTextNode(currentText.substring(lastIndex))
    );
  }
  
  // Replace the text node only if we made changes
  if (fragment.childNodes.length > 0) {
    processedNodes.add(textNode);
    textNode.parentNode.replaceChild(fragment, textNode);
  }
}

// Function to walk through all text nodes
function walkTextNodes(node) {
  if (!showTimestamps) {
    return;
  }
  
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    processTextNode(node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Skip script and style elements
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || 
        node.tagName === 'NOSCRIPT' || node.classList.contains('unix-timestamp-converter')) {
      return;
    }
    
    // Process child nodes (create a copy to avoid live collection issues)
    const children = Array.from(node.childNodes);
    for (const child of children) {
      walkTextNodes(child);
    }
  }
}

// Function to restore original content
function restoreOriginalContent() {
  const wrappers = document.querySelectorAll('.unix-timestamp-converter');
  wrappers.forEach(wrapper => {
    const originalText = wrapper.getAttribute('data-original-text');
    if (originalText && wrapper.parentNode) {
      const textNode = document.createTextNode(originalText);
      wrapper.parentNode.replaceChild(textNode, wrapper);
    }
  });
  // Clear processed nodes since we're starting fresh
  processedNodes.clear?.() || (function() {
    // WeakSet doesn't have clear method in older browsers, but that's OK
    // since we're replacing elements anyway
  })();
}

// Initial conversion with delay to ensure DOM is ready
setTimeout(() => {
  walkTextNodes(document.body);
}, 100);

// Observer for dynamic content
const observer = new MutationObserver(mutations => {
  if (!showTimestamps) {
    return;
  }
  
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          walkTextNodes(node);
        }
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Toggle functionality
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    showTimestamps = !showTimestamps;
    
    if (showTimestamps) {
      // When turning ON: re-process all content to convert timestamps
      walkTextNodes(document.body);
    } else {
      // When turning OFF: restore original content
      restoreOriginalContent();
    }
    
    sendResponse({status: showTimestamps});
  }
  return true;
});