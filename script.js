
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalLyricsBox = document.getElementById('modalLyrics');
const modalLyricsWrapper = document.getElementById('modalLyricsWrapper');
const modalTitle = document.getElementById('modalTitle');
const modalSinger = document.getElementById('modalSinger');
const modalProgress = document.getElementById('modalProgress');
const modalProgressFill = document.getElementById('modalProgressFill');
const modalCurrent = document.getElementById('modalCurrent');
const modalTotal = document.getElementById('modalTotal');
const modalPlay = document.getElementById('modalPlay');
const modalPause = document.getElementById('modalPause');

const playerThumb = document.getElementById('playerThumb');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const volRange = document.getElementById('volRange');
const bgVideo = document.getElementById('bgVideo');

let currentLyrics = [];
let lastHighlighted = -1;
let currentAudioSrc = '';
const modalAudio = new Audio();
modalAudio.preload = 'metadata';
modalAudio.crossOrigin = "anonymous";

function fmt(seconds){
  if(!isFinite(seconds)) return '0:00';
  const m=Math.floor(seconds/60);
  const s=Math.floor(seconds%60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

document.querySelectorAll('.song').forEach(article=>{
  article.addEventListener('mouseenter', ()=>{
    const vid = article.dataset.video || '';
    if(vid) bgVideo.src = vid;
  });

  article.addEventListener('click', ()=>{
    const img = article.dataset.img || '';
    const audio = article.dataset.audio || '';
    let lyrics = [];
    try{ lyrics = JSON.parse(article.dataset.lyrics||'[]'); }catch(e){ lyrics=[]; }

    const isSame = (currentAudioSrc === audio);
    if(!isSame){
      currentAudioSrc = audio;
      modalAudio.src = audio;
      modalAudio.currentTime = 0;
    }

    currentLyrics = Array.isArray(lyrics)?lyrics:[];
    lastHighlighted = -1;

    playerThumb.src = img;
    playerTitle.textContent = article.dataset.title || '';
    playerArtist.textContent = article.dataset.singer || '';

    modalTitle.textContent = article.dataset.title || '';
    modalSinger.textContent = article.dataset.singer || '';

    openModal(img);
    modalAudio.play().catch(()=>{});
  });
});

function openModal(img){
  modalImg.src = img;
  renderLyrics();
  modalLyricsWrapper.scrollTop = 0;
  modal.classList.remove('hidden');
  document.body.classList.add('hide-ui');
  setTimeout(()=> modalContent.classList.add('active'), 10);
  togglePlayButtons(!modalAudio.paused);
}

modalClose.addEventListener('click', ()=> {
  modalContent.classList.remove('active');
  document.body.classList.remove('hide-ui');
  setTimeout(()=> modal.classList.add('hidden'), 220);
});

function renderLyrics(){
  modalLyricsBox.innerHTML = '';
  currentLyrics.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.dataset.time = item.time;
    div.dataset.duration = item.duration || 0; 
    div.textContent = item.line;
    modalLyricsBox.appendChild(div);
  });
  lastHighlighted = -1;
}

function togglePlayButtons(isPlaying){
  modalPlay.classList.toggle('hidden', isPlaying);
  modalPause.classList.toggle('hidden', !isPlaying);
}

modalProgress.addEventListener('click', e=>{
  const pct = (e.clientX - modalProgress.getBoundingClientRect().left) / modalProgress.offsetWidth;
  if(modalAudio.duration) modalAudio.currentTime = pct * modalAudio.duration;
});
progress.addEventListener('click', e=>{
  const pct = (e.clientX - progress.getBoundingClientRect().left) / progress.offsetWidth;
  if(modalAudio.duration) modalAudio.currentTime = pct * modalAudio.duration;
});

modalPlay.addEventListener('click', ()=> modalAudio.play());
modalPause.addEventListener('click', ()=> modalAudio.pause());
playBtn.addEventListener('click', ()=> modalAudio.play());
pauseBtn.addEventListener('click', ()=> modalAudio.pause());

volRange.addEventListener('input', e=> modalAudio.volume = parseFloat(e.target.value));

modalAudio.addEventListener('timeupdate', ()=>{
  if(modalAudio.duration){
    const pct = modalAudio.currentTime / modalAudio.duration * 100;
    modalProgressFill.style.width = pct + '%';
    modalCurrent.textContent = fmt(modalAudio.currentTime);
    progressFill.style.width = pct + '%';
  }
  highlightLyrics(modalAudio.currentTime);
});

modalAudio.addEventListener('loadedmetadata', ()=> modalTotal.textContent = fmt(modalAudio.duration));

modalAudio.addEventListener('play', ()=> togglePlayButtons(true));
modalAudio.addEventListener('pause', ()=> togglePlayButtons(false));

function highlightLyrics(currentTime){
  if(!currentLyrics.length) return;

  let idx = -1;
  for(let i=0;i<currentLyrics.length;i++){
    const t = Number(currentLyrics[i].time);
    const dur = Number(currentLyrics[i].duration || 0);
    const nextT = (dur>0)? t + dur : (i<currentLyrics.length-1 ? Number(currentLyrics[i+1].time) : Infinity);
    if(currentTime>=t && currentTime<nextT){
      idx=i; 
      break;
    }
  }

  if(idx===-1 || idx===lastHighlighted) return;

  const lines = modalLyricsBox.querySelectorAll('.lyric-line');
  if(lines[lastHighlighted]) lines[lastHighlighted].classList.remove('lyric-active');

  if(lines[idx]){
    lines[idx].classList.add('lyric-active');
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        const wrapperHeight = modalLyricsWrapper.clientHeight;
        const lineOffset = lines[idx].offsetTop + lines[idx].offsetHeight/2;
        const newTop = lineOffset - wrapperHeight/2;
        modalLyricsWrapper.scrollTo({ top: newTop, behavior: 'smooth' });
      });
    });
  }

  lastHighlighted = idx;
}

document.addEventListener('keydown', e=>{
  if(e.code==='Space' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){
    e.preventDefault();
    modalAudio.paused ? modalAudio.play() : modalAudio.pause();
  }
});
