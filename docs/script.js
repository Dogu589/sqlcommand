function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  html.classList.toggle('dark', !isDark);
  html.classList.toggle('light', isDark);
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function generateCommand() {
  let command = 'sqlmap';
  
  // Target options
  const url = document.getElementById('url').value;
  const googleDork = document.getElementById('google-dork').value;
  
  if (url) command += ` -u "${url}"`;
  if (googleDork) command += ` -g "${googleDork}"`;
  
  // Request options
  const data = document.getElementById('data').value;
  const cookie = document.getElementById('cookie').value;
  
  if (data) command += ` --data="${data}"`;
  if (cookie) command += ` --cookie="${cookie}"`;
  
  // Connection options
  if (document.getElementById('random-agent').checked) command += ' --random-agent';
  if (document.getElementById('tor').checked) command += ' --tor';
  
  const proxy = document.getElementById('proxy').value;
  if (proxy) command += ` --proxy="${proxy}"`;
  
  // Detection options
  const level = document.getElementById('level').value;
  const risk = document.getElementById('risk').value;
  const verbosity = document.getElementById('verbosity').value;
  command += ` --level=${level} --risk=${risk} -v ${verbosity}`;
  
  // Techniques
  let techniques = '';
  ['b', 'e', 'u', 's', 't', 'q'].forEach(tech => {
    if (document.getElementById(`tech-${tech}`).checked) {
      techniques += tech.toUpperCase();
    }
  });
  if (techniques) command += ` --technique=${techniques}`;
  
  // Enumeration options
  const enumOptions = [
    'all', 'banner', 'current-user', 'current-db', 'passwords',
    'dbs', 'tables', 'columns', 'schema', 'dump'
  ];
  enumOptions.forEach(opt => {
    if (document.getElementById(opt).checked) {
      command += ` --${opt}`;
    }
  });
  
  // Advanced options
  const advancedOptions = ['os-shell', 'os-pwn', 'batch', 'flush-session'];
  advancedOptions.forEach(opt => {
    if (document.getElementById(opt).checked) {
      command += ` --${opt}`;
    }
  });
  
  document.getElementById('output').textContent = command;
}

function copyCommand() {
  const output = document.getElementById('output');
  navigator.clipboard.writeText(output.textContent)
    .then(() => {
      const btn = document.querySelector('.copy-btn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy Command', 2000);
    })
    .catch(err => console.error('Failed to copy:', err));
}

// Handle incompatible options
document.getElementById('all').addEventListener('change', function() {
  const enumOptions = [
    'banner', 'current-user', 'current-db', 'passwords',
    'dbs', 'tables', 'columns', 'schema', 'dump'
  ];
  enumOptions.forEach(opt => {
    const el = document.getElementById(opt);
    el.disabled = this.checked;
    if (this.checked) el.checked = false;
  });
});
