const cursor = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function ani(){cursor.style.transform=`translate(${mx-4}px,${my-4}px)`;rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.transform=`translate(${rx-16}px,${ry-16}px)`;requestAnimationFrame(ani);})();

window.addEventListener('scroll',()=>{document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>40);});

const html=document.documentElement, btn=document.getElementById('themeToggle');

// Palette list (mirrors head script)
const palettes = [
  { name:'ferrari',       dark:'#FF2D55', dark2:'#FF6B35', light:'#CC0023', light2:'#A00018' },
  { name:'mclaren',       dark:'#FF8000', dark2:'#FFD60A', light:'#C45E00', light2:'#8A4200' },
  { name:'red bull',      dark:'#6AA8FF', dark2:'#FFD700', light:'#1B39A0', light2:'#0D2070' },
  { name:'mercedes',      dark:'#00D2BE', dark2:'#C0D0CC', light:'#007A6E', light2:'#005048' },
  { name:'alpine',        dark:'#FF87BC', dark2:'#0093CC', light:'#BE185D', light2:'#0369A1' },
  { name:'aston martin',  dark:'#00FF87', dark2:'#00E8A0', light:'#006340', light2:'#004A2F' },
  { name:'williams',      dark:'#37BEDD', dark2:'#7DD3FC', light:'#0047AB', light2:'#003380' },
  { name:'haas',          dark:'#FF4444', dark2:'#CCCCCC', light:'#CC0000', light2:'#888888' },
  { name:'kick sauber',   dark:'#39FF14', dark2:'#00C4B4', light:'#166534', light2:'#0D4A2A' },
  { name:'racing bulls',  dark:'#7B9FFF', dark2:'#B3C6FF', light:'#2B3FAA', light2:'#1A2880' },
];

// Go to top button
const goTop = document.getElementById('goTop');
window.addEventListener('scroll', () => {
  goTop.classList.toggle('visible', window.scrollY > 400);
});

function applyPalette(p, theme) {
  const isDark = (theme || html.getAttribute('data-theme')) === 'dark';
  html.style.setProperty('--accent',  isDark ? p.dark  : p.light);
  html.style.setProperty('--accent2', isDark ? p.dark2 : p.light2);
  document.getElementById('colorDot').style.background = isDark ? p.dark : p.light;
  document.getElementById('colorName').textContent = p.name;
}

// Init colour dot from head-applied palette
const initIdx = +(html.dataset.palette || 0);
applyPalette(palettes[initIdx]);

// Theme toggle — reapply correct accent for new theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
applyPalette(palettes[initIdx], savedTheme);

btn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  applyPalette(palettes[+(html.dataset.palette||0)], next);
});

// Reroll button — pick a new random palette (different from current)
document.getElementById('colorBtn').addEventListener('click', () => {
  let newIdx;
  const cur = +(html.dataset.palette||0);
  do { newIdx = Math.floor(Math.random() * palettes.length); } while(newIdx === cur);
  html.dataset.palette = newIdx;
  sessionStorage.setItem('paletteIdx', newIdx);
  applyPalette(palettes[newIdx]);
});

const roles=['QA Automation Engineer','ML Researcher','Software Engineer','CS Graduate Student'];
let ri=0,ci=0,del=false;
const te=document.getElementById('typed-text');
function type(){const r=roles[ri];if(!del){ci++;te.innerHTML=`MS CS @ UMass Amherst · ${r.slice(0,ci)}<span class="typed-cursor">|</span>`;if(ci===r.length){del=true;setTimeout(type,2000);return;}}else{ci--;te.innerHTML=`MS CS @ UMass Amherst · ${r.slice(0,ci)}<span class="typed-cursor">|</span>`;if(ci===0){del=false;ri=(ri+1)%roles.length;}}setTimeout(type,del?40:80);}
setTimeout(type,1500);

const obs=new IntersectionObserver((entries)=>{entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*80);});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// PDF MODAL — Google Docs Viewer for direct PDFs, auto-open for DOI links
let currentPdfUrl = '';
function openPDF(url, title, journal) {
  currentPdfUrl = url;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalJournal').textContent = '// ' + journal;
  document.getElementById('modalOpenLink').href = url;
  document.getElementById('fallbackLink').href = url;
  document.getElementById('pdfLoading').style.display = 'flex';
  document.getElementById('pdfFallback').classList.remove('show');
  document.getElementById('pdfModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  const frame = document.getElementById('pdfFrame');
  frame.src = '';

  const isDOI = url.includes('doi.org');

  if (isDOI) {
    // DOI links redirect and can't be proxied — open in new tab and show message
    window.open(url, '_blank');
    document.getElementById('pdfLoading').style.display = 'none';
    document.getElementById('pdfFallback').classList.add('show');
    document.getElementById('fallbackMsg').innerHTML =
      '<span>// opened in new tab</span>This paper was opened in a new tab since the publisher does not support embedded viewing. If nothing opened, click the button below.';
  } else {
    // Use Google Docs Viewer as proxy for direct PDF links
    frame.src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    let timer = setTimeout(showFallback, 10000);
    frame.onload = () => { clearTimeout(timer); document.getElementById('pdfLoading').style.display = 'none'; };
    frame.onerror = () => { clearTimeout(timer); showFallback(); };
  }
}
function showFallback() {
  document.getElementById('pdfLoading').style.display = 'none';
  document.getElementById('pdfFallback').classList.add('show');
  document.getElementById('fallbackMsg').innerHTML =
    '<span>// viewer unavailable</span>Google Docs viewer couldn\'t load this PDF. Click below to open it directly.';
}
function closePDF() {
  document.getElementById('pdfModal').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(()=>{ document.getElementById('pdfFrame').src=''; }, 300);
}
// Hide custom cursor when mouse enters iframe (iframes block parent mousemove)
document.getElementById('pdfFrame').addEventListener('mouseenter', () => {
  cursor.style.opacity = '0'; ring.style.opacity = '0';
});
document.getElementById('pdfFrame').addEventListener('mouseleave', () => {
  cursor.style.opacity = '1'; ring.style.opacity = '0.4';
});
document.getElementById('pdfModal').addEventListener('click', function(e){ if(e.target===this) closePDF(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closePDF(); });