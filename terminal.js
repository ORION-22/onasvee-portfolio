/* ============================================================
   TERMINAL + EASTER EGGS (FOOTER EMBEDDED VERSION)
   ============================================================ */

(function () {

  /* ── ELEMENTS ───────────────────────────────────────────── */
/* Look for the element declarations at the top of terminal.js and add termNavBtn: */
const termBtn      = document.getElementById('termBtn');
const termNavBtn   = document.getElementById('termNavBtn'); // <-- Add this line
const termInput    = document.getElementById('termInput');
const termOutput   = document.getElementById('termOutput');
const termGhost    = document.getElementById('termGhost');
const footerTerm   = document.getElementById('footerTerminal');

/* Scroll all the way down to the event listeners area (around line 155) and add: */
if (termNavBtn) {
  termNavBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents click-outside from instantly closing it
    openTerm();
    // Ensures a smooth focus-scroll into view after opening
    setTimeout(() => {
      document.getElementById('siteFooter').scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 150);
  });
}

  /* Safety check */
  if (!termInput || !termOutput || !footerTerm) return;

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
    'help', 'help easter', 'clear', 'whoami', // <-- added 'help easter' here
    'theme dark', 'theme light', 'theme f1', 'theme space',
    'race', 'rover', 'jwst', 'telescope', 'launch',
    'konami',
  ];

  /* ── HISTORY ────────────────────────────────────────────── */
  let cmdHistory = [];
  let histIdx    = -1;

  /* ── OPEN / CLOSE ───────────────────────────────────────── */
  function openTerm() {
    footerTerm.classList.add('open');
    setTimeout(() => termInput.focus(), 50);
    if (termOutput.childElementCount === 0) {
      printWelcome();
    }
    footerTerm.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function closeTerm() {
    footerTerm.classList.remove('open');
    termInput.blur();
  }

  function toggleTerm() {
    footerTerm.classList.contains('open') ? closeTerm() : openTerm();
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
    line("press ` or click ⌃ to toggle");
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
      line('  theme f1    |  theme space');
      gap();
      line('other:');
      line('  whoami      — about this terminal');
      line('  clear       — clear output');
      line('  help easter — [CLASSIFIED]');
      line('  konami      — hint: ↑↑↓↓←→←→BA');
      gap(); return;
    }

    /* help easter */
    if (cmd === 'help easter') {
      line('// easter eggs unlocked', 'accent');
      line('  race        — F1 race simulation');
      line('  rover       — NASA rover mission control');
      line('  jwst        — astronomy picture of the day');
      line('  launch      — SpaceX launch countdown');
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
    if (cmd.startsWith('theme ')) {
      const theme = cmd.split(' ')[1];
      if (['dark', 'light', 'f1', 'space'].includes(theme)) {
        document.documentElement.setAttribute('data-theme', theme);
        line(`→ theme set to '${theme}'`, 'accent');
      } else {
        line(`unknown theme: '${theme}'`, 'err');
        line("available: dark, light, f1, space");
      }
      gap(); return;
    }

    /* easter eggs */
    if (['race', 'rover', 'jwst', 'telescope', 'launch'].includes(cmd)) {
      openEggWindow(cmd === 'telescope' ? 'jwst' : cmd);
      gap(); return;
    }

    /* konami */
    if (cmd === 'konami') {
      line('hint: ↑ ↑ ↓ ↓ ← → ← → B A', 'accent');
      line('try it anywhere on the page...');
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
      // Auto-open if collapsed
      if (!footerTerm.classList.contains('open')) {
        openTerm();
        setTimeout(() => runCommand(val), 100);
      } else {
        runCommand(val);
      }
          // Forces the browser to scroll down and keep the input visible as the terminal expands
      setTimeout(() => {
        termInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
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

  /* Focus input → auto open */
  termInput.addEventListener('focus', () => {
    if (!footerTerm.classList.contains('open')) openTerm();
  });

  /* Toggle button */
  termBtn.addEventListener('click', toggleTerm);

  /* Backtick anywhere toggles terminal */
  document.addEventListener('keydown', e => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleTerm();
      if (!footerTerm.classList.contains('open')) {
        document.getElementById('siteFooter').scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  });

  /* Click outside to close */
  document.addEventListener('click', e => {
    if (footerTerm.classList.contains('open') &&
        !footerTerm.contains(e.target)) {
      closeTerm();
    }
  });

  /* ── GENERIC EASTER EGG POPUP ───────────────────────────── */
  const EGG_CONFIG = {
    race:   { icon: '🏎️', label: '// f1_race.sim',           msg: 'F1 race simulation — coming soon.\nFive cars. One track. HIRE ME always podiums.' },
    rover:  { icon: '🛸', label: '// nasa_rover.telemetry',   msg: 'NASA rover mission control — coming soon.\nReal Perseverance data via NASA open API.' },
    jwst:   { icon: '🔭', label: '// jwst.apod',              msg: 'Astronomy Picture of the Day — coming soon.\nDaily NASA imagery via APOD API.' },
    launch: { icon: '🚀', label: '// spacex.launch_countdown', msg: 'SpaceX launch countdown — coming soon.\nNext launch data via The Space Devs API.' },
  };

  const eggOverlay = document.getElementById('eggOverlay');
  const eggTitle   = document.getElementById('eggTitle');
  const eggBody    = document.getElementById('eggBody');
  const eggClose   = document.getElementById('eggClose');

  function openEggWindow(key) {
    const cfg = EGG_CONFIG[key];
    if (!cfg || !eggOverlay) return;
    eggTitle.textContent = cfg.label;
    eggBody.textContent = `${cfg.icon}\n\n${cfg.msg}`;
    eggOverlay.classList.add('open');
  }

  function closeEggWindow() {
    if (eggOverlay) eggOverlay.classList.remove('open');
  }

  if (eggClose) eggClose.addEventListener('click', closeEggWindow);
  if (eggOverlay) eggOverlay.addEventListener('click', e => {
    if (e.target === eggOverlay) closeEggWindow();
  });

  // Make openEggWindow available globally (for other scripts)
  window.openEggWindow = openEggWindow;

  /* ── KONAMI CODE ────────────────────────────────────────── */
  const konamiOverlay = document.getElementById('konamiOverlay');
  const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  let konamiIdx = 0;

  document.addEventListener('keydown', e => {
    if (e.code === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        if (konamiOverlay) konamiOverlay.classList.add('open');
      }
    } else {
      konamiIdx = 0;
    }
  });

  // Close konami
  if (konamiOverlay) {
    konamiOverlay.addEventListener('click', e => {
      if (e.target === konamiOverlay || e.target.closest('button')) {
        konamiOverlay.classList.remove('open');
      }
    });
  }

})();