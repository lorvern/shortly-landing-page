document.addEventListener('DOMContentLoaded', () => {

  /* MOBILE NAVIGATION */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }


  /* LINK SHORTENER */
  const urlInput    = document.getElementById('url-input');
  const errorMsg    = document.getElementById('error-msg');
  const shortenBtn  = document.getElementById('shorten-btn');
  const resultsList = document.getElementById('results-list');

  const shortCodes = [
    'k4lKyk', 'gxOXp8', 'gob3X9',
    'mR7qPs', 'nZ2wVx', 'pQ9kLm',
    'rT5hBn', 'wJ8vCe', 'yK3dFo',
  ];
  let codeIndex = 0;

  function generateShortUrl() {
    const code = shortCodes[codeIndex % shortCodes.length];
    codeIndex++;
    return `https://rel.ink/${code}`;
  }

  function isValidUrl(str) {
    const trimmed = str.trim();
    if (!trimmed) return false;
    try {
      const url = new URL(trimmed);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(trimmed);
    }
  }

  function showError(message) {
    urlInput.classList.add('error');
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    urlInput.focus();
  }

  function clearError() {
    urlInput.classList.remove('error');
    errorMsg.classList.remove('show');
  }

  function shortenLink() {
    const url = urlInput.value.trim();

    if (!url) {
      showError('Please add a link');
      return;
    }

    if (!isValidUrl(url)) {
      showError('Please add a valid link');
      return;
    }

    clearError();
    const shortUrl = generateShortUrl();
    addResult(url, shortUrl);
    urlInput.value = '';
  }

  function addResult(original, short) {
    const displayOriginal =
      original.length > 55 ? original.slice(0, 55) + '…' : original;

    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <span class="result-original" title="${escapeHtml(original)}">${escapeHtml(displayOriginal)}</span>
      <div class="result-right">
        <a href="${escapeHtml(short)}" class="result-short" target="_blank" rel="noopener">${escapeHtml(short)}</a>
        <button class="btn-copy" data-url="${escapeHtml(short)}" aria-label="Copy shortened link">Copy</button>
      </div>
    `;

    resultsList.appendChild(item);
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  resultsList.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;

    const urlToCopy = btn.dataset.url;

    document.querySelectorAll('.btn-copy.copied').forEach((b) => {
      if (b !== btn) {
        b.textContent = 'Copy';
        b.classList.remove('copied');
        b.setAttribute('aria-label', 'Copy shortened link');
      }
    });

    try {
      await navigator.clipboard.writeText(urlToCopy);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = urlToCopy;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Copied!');
  });

  shortenBtn.addEventListener('click', shortenLink);

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') shortenLink();
  });

  urlInput.addEventListener('input', () => {
    if (urlInput.value.trim()) clearError();
  });

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
  
});


