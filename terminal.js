/* ============================================================
   TERMINAL + EASTER EGGS
   Append this entire block to the bottom of your script.js
   ============================================================ */

(function () {

  /* ── ELEMENTS ───────────────────────────────────────────── */
  const termBtn    = document.getElementById('termBtn');
  const termPanel  = document.getElementById('termPanel');
  const termInput  = document.getElementById('termInput');
  const termOutput = document.getElementById('termOutput');
  const termClose  = document.getElementById('termClose');
  const termGhost  = document.getElementById('termGhost');

  /* ── SECTION MAP ────────────────────────────────────────── */
  const NAV = {
    home:           '#hero',
    hero:           '#hero',
    about:          '#about',
    education:      '#education',
    skills:         '#skills',
    experience:     '#experience',
    projects:       '#projects',
    publications:   '#publications',
    certifications: '#certifications',
    contact:        '#contact',
  };

  /* ── ALL KNOWN COMMANDS (for autocomplete) ──────────────── */
  const ALL_CMDS = [
    ...Object.keys(NAV),
    'help', 'clear', 'whoami',
    'theme dark', 'theme light', 'theme f1', 'theme space',
    'race', 'rover', 'jwst', 'telescope', 'launch',
    'konami',
  ];

  /* ── HISTORY ────────────────────────────────────────────── */
  let cmdHistory = [];
  let histIdx    = -1;

  /* ── OPEN / CLOSE ───────────────────────────────────────── */
  function openTerm() {
    termPanel.classList.add('open');
    termBtn.classList.add('active');
    setTimeout(() => termInput.focus(), 50);
    // Print welcome on first open
    if (termOutput.childElementCount === 0) {
      printWelcome();
    }
  }

  function closeTerm() {
    termPanel.classList.remove('open');
    termBtn.classList.remove('active');
    termInput.blur();
  }

  function toggleTerm() {
    termPanel.classList.contains('open') ? closeTerm() : openTerm();
  }

  /* ── PRINT HELPERS ──────────────────────────────────────── */
  function line(text, type = 'out') {
    const el = document.createElement('div');
    el.className = `term-line ${type}`;
    el.textContent = text;
    termOutput.appendChild(el);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function gap() {
    const el = document.createElement('div');
    el.className = 'term-line gap';
    termOutput.appendChild(el);
  }

  function printWelcome() {
    line('// onasvee.dev — terminal v1.0', 'accent');
    line("type 'help' for available commands");
    line("press ` or click >_ to toggle");
    gap();
  }

  /* ── AUTOCOMPLETE ───────────────────────────────────────── */
  termInput.addEventListener('input', () => {
    const val = termInput.value.toLowerCase().trim();
    if (!val) { termGhost.textContent = ''; return; }
    const match = ALL_CMDS.find(c => c.startsWith(val) && c !== val);
    termGhost.textContent = match ? match.slice(val.length) : '';
  });

  /* ── COMMAND RUNNER ─────────────────────────────────────── */
  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    // Record history
    cmdHistory.unshift(raw.trim());
    histIdx = -1;
    termGhost.textContent = '';

    // Echo command
    line(raw.trim(), 'cmd');

    /* Navigation */
    if (NAV[cmd]) {
      const target = document.querySelector(NAV[cmd]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        line(`→ navigating to ${cmd}...`, 'accent');
        setTimeout(closeTerm, 600);
      }
      gap(); return;
    }

    /* help */
    if (cmd === 'help') {
      line('navigation:');
      line('  home · about · education · skills');
      line('  experience · projects · publications');
      line('  certifications · contact');
      gap();
      line('theme:');
      line('  theme dark  |  theme light');
      gap();
      line('easter eggs:');
      line('  race        — F1 race simulation');
      line('  rover       — NASA rover mission control');
      line('  jwst        — astronomy picture of the day');
      line('  launch      — SpaceX launch countdown');
      gap();
      line('other:');
      line('  whoami      — about this terminal');
      line('  clear       — clear output');
      line('  konami      — hint: ↑↑↓↓←→←→BA');
      gap(); return;
    }

    /* clear */
    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      return;
    }

    /* whoami */
    if (cmd === 'whoami') {
      line('Onasvee Banarse', 'accent');
      line('MS CS @ UMass Amherst');
      line('QA Automation Engineer → Software Engineer');
      line('github.com/ORION-22');
      gap(); return;
    }

    /* theme */
    if (cmd === 'theme dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      applyPalette(palettes[+(document.documentElement.dataset.palette || 0)], 'dark');
      line('→ theme set to dark', 'accent');
      gap(); return;
    }
    if (cmd === 'theme light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      applyPalette(palettes[+(document.documentElement.dataset.palette || 0)], 'light');
      line('→ theme set to light', 'accent');
      gap(); return;
    }
    if (cmd === 'theme f1' || cmd === 'theme space') {
      line(`→ ${cmd} — coming in next update 🚧`, 'accent');
      gap(); return;
    }

    /* ── EASTER EGGS ──────────────────────────────────────── */

    /* konami — just a hint, actual trigger is the key sequence */
    if (cmd === 'konami') {
      line('hint: try ↑ ↑ ↓ ↓ ← → ← → B A', 'accent');
      line('(arrow keys + B + A, in sequence)');
      gap(); return;
    }

    /* race — coming soon stub */
    if (cmd === 'race') {
      openEggWindow('race');
      gap(); return;
    }

    /* rover — coming soon stub */
    if (cmd === 'rover') {
      openEggWindow('rover');
      gap(); return;
    }

    /* jwst / telescope */
    if (cmd === 'jwst' || cmd === 'telescope') {
      openEggWindow('jwst');
      gap(); return;
    }

    /* launch */
    if (cmd === 'launch') {
      openEggWindow('launch');
      gap(); return;
    }

    /* unknown */
    line(`command not found: '${cmd}'`, 'err');
    line("type 'help' to see available commands");
    gap();
  }

  /* ── INPUT EVENTS ───────────────────────────────────────── */
  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      termGhost.textContent = '';
      runCommand(val);
    }

    /* Tab → accept autocomplete */
    if (e.key === 'Tab') {
      e.preventDefault();
      const ghost = termGhost.textContent;
      if (ghost) { termInput.value += ghost; termGhost.textContent = ''; }
    }

    /* Up / Down → history */
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        termInput.value = cmdHistory[histIdx];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; termInput.value = cmdHistory[histIdx]; }
      else { histIdx = -1; termInput.value = ''; }
    }

    /* Escape → close */
    if (e.key === 'Escape') closeTerm();
  });

  /* Backtick anywhere toggles terminal */
  document.addEventListener('keydown', e => {
    if (e.key === '`' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleTerm();
    }
  });

  termBtn.addEventListener('click', toggleTerm);
  termClose.addEventListener('click', closeTerm);

  /* Click outside to close */
  document.addEventListener('click', e => {
    if (termPanel.classList.contains('open') &&
        !termPanel.contains(e.target) &&
        !termBtn.contains(e.target)) {
      closeTerm();
    }
  });

  /* ── GENERIC EASTER EGG POPUP ───────────────────────────── */
  const EGG_CONFIG = {
    race:  { icon: '🏎️', label: '// f1_race.sim', msg: 'F1 race simulation — coming soon.\nFive cars. One track. HIRE ME always podiums.' },
    rover: { icon: '🛸', label: '// nasa_rover.telemetry', msg: 'NASA rover mission control — coming soon.\nReal Perseverance data via NASA open API.' },
    jwst:  { icon: '🔭', label: '// jwst.apod', msg: 'Astronomy Picture of the Day — coming soon.\nDaily NASA imagery via APOD API.' },
    launch:{ icon: '🚀', label: '// spacex.launch_countdown', msg: 'SpaceX launch countdown — coming soon.\nNext launch data via The Space Devs API.' },
  };

  const eggOverlay = document.getElementById('eggOverlay');
  const eggTitle   = document.getElementById('eggTitle');
  const eggBody    = document.getElementById('eggBody');

  function openEggWindow(key) {
    const cfg = EGG_CONFIG[key];
    if (!cfg) return;
    eggTitle.textContent = cfg.label;
    eggBody.innerHTML = `
      <div class="egg-coming-soon">
        <div class="egg-icon">${cfg.icon}</div>
        <div class="egg-cmd">${key}</div>
        <div class="egg-msg">${cfg.msg.replace(/\n/g,'<br>')}</div>
      </div>`;
    eggOverlay.classList.add('open');
    closeTerm();
  }

  document.getElementById('eggClose').addEventListener('click', () => {
    eggOverlay.classList.remove('open');
  });
  eggOverlay.addEventListener('click', e => {
    if (e.target === eggOverlay) eggOverlay.classList.remove('open');
  });

  /* ── KONAMI CODE ─────────────────────────────────────────── */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
                  'b','a'];
  let konamiIdx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        openKonami();
      }
    } else {
      konamiIdx = e.key === KONAMI[0] ? 1 : 0;
    }
  });

  const konamiOverlay = document.getElementById('konamiOverlay');

  function openKonami() {
    konamiOverlay.classList.add('open');
    closeTerm();
    // Live uptime counter
    const start = Date.now();
    const uptimeEl = document.getElementById('konamiUptime');
    const tick = () => {
      if (!konamiOverlay.classList.contains('open')) return;
      const s = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
      const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
      uptimeEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')} this session`;
      setTimeout(tick, 1000);
    };
    tick();
  }

  window.closeKonami = function () {
    konamiOverlay.classList.remove('open');
  };

  konamiOverlay.addEventListener('click', e => {
    if (e.target === konamiOverlay) closeKonami();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && konamiOverlay.classList.contains('open')) closeKonami();
  });

})();
