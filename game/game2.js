import { getMode, $ } from '../common/ui.js';

const mode = getMode();
const cfgMap = {
  replication: '../mode/replication/config.js',
  transcription: '../mode/transcription/config.js', // ทำภายหลัง
  translation: '../mode/translation/config.js',     // ทำภายหลัง
};

// โหลด config ตามโหมด
const { MAX_SCORE, CATALOG, STEPS } = await import(cfgMap[mode]);

// ------- state -------
let stepIndex = 0;           // index ของ STEPS
let score = 0;
let firstAttempt = true;
let locked = false;          // จบเกมแล้ว/ล็อกไว้
let awaitingInput = false;   // อยู่ขั้นที่ต้องกรอกอยู่ไหม
let templateDNA = '';        // ใช้ในโหมดนี้ (ctx จะอัปเดตตัวนี้ให้)

// ------- DOM -------
const actions       = $('#actions');
const instructions  = $('#game-instructions');
const imageEl       = $('#dna-image');
const inputBox      = $('#input-container');
const randomDNABox  = $('#random-dna-container');
const userInputEl   = $('#user-input');
const checkBtn      = $('#check-btn');
const plusOneEl     = $('#plusOne');
const scoreValEl = document.getElementById('scoreVal');


// (ถ้ามี track/dots จาก shop ให้คุณ render ตามเดิม)

// ------- helper shown in config ctx -------
function setText(msg, color){ instructions.textContent = msg; if(color) instructions.style.color = color; }
function setImage(src){ imageEl.src = src; }
function setSequence(paths, delays){ paths.forEach((src,i)=> setTimeout(()=> setImage(src), delays[i]||0)); }
function lock(){ locked = true; }

function awardIfFirstAttempt(){
  if(!firstAttempt) return;
  score += 1;

  if (scoreValEl) scoreValEl.textContent = String(score);

  localStorage.setItem(`${mode}Score`, String(score));
  localStorage.setItem(`${mode}Max`, String(MAX_SCORE));


  plusOneEl.classList.add('show');
  setTimeout(()=> plusOneEl.classList.remove('show'), 1000);
  firstAttempt = false;
}

// ctx ที่ส่งให้ config
const ctx = {
  text: setText,
  image: setImage,
  setSequence,
  inputBox,
  randomDNABox,
  userInput: userInputEl,
  get templateDNA(){ return templateDNA; },
  set templateDNA(v){ templateDNA = v; },
  lock
};

// ------- render ปุ่มเอนไซม์จาก list ที่ผู้ใช้เลือกไว้ใน shop -------
const catalog = JSON.parse(localStorage.getItem('enzymesCatalog') || '[]');
const byId = Object.fromEntries(catalog.map(e => [e.id, e]));
const chosen = JSON.parse(localStorage.getItem('selectedEnzymes') || '[]');

actions.innerHTML = chosen.map(id => {
  const e = byId[id] || CATALOG.find(x=>x.id===id) || { name:id, color:'#ccc' };
  const icon = e.img
    ? `<span class="icon-dot"><img src="${e.img}" alt="${e.name}"></span>`
    : `<span class="icon-dot" style="background:${e.color||'#ccc'}"></span>`;
  return `<button class="enzyme-btn" data-id="${id}">${icon}<span>${e.name}</span></button>`;
}).join('');

// ------- core engine: next/enter/check -------
function currentStep(){ return STEPS[stepIndex]; }

function enterStep(){
  firstAttempt = true;
  const s = currentStep();
  awaitingInput = !!s.requiresInput;
  if (s.requiresInput) {
    setText(s.prompt || 'Enter your answer', 'green');
    if (s.onEnter) s.onEnter(ctx);
  } else {
    inputBox.classList.add('hidden');
    setText(s.idleMsg || 'Choose an enzyme to proceed...', s.idleColor || '#000000ff');

  }
}

function goNext(){
  stepIndex += 1;
  if (stepIndex >= STEPS.length){ lock(); return; }
  enterStep();
}

// เริ่มต้น
enterStep();

actions.querySelectorAll('.enzyme-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if (locked) return;
    if (awaitingInput) return;  // step ที่ต้องกรอก ให้กด CHECK เท่านั้น

    const id = btn.getAttribute('data-id');
    const s = currentStep();

    if (id === s.correctId){
      btn.classList.add('correct');
      awardIfFirstAttempt();
      if (s.okMsg) setText(s.okMsg, s.okColor || 'green');
      if (s.image) setImage(s.image);
      if (s.onCorrect) s.onCorrect(ctx);

      if (s.requiresInput){
        // step แบบต้องกรอก: ยังไม่ไปต่อ รอ CHECK
        awaitingInput = true;
      } else {
        setTimeout(()=>{
          btn.classList.remove('correct');
          if (s.onAfter) s.onAfter(ctx);
          if (!locked) goNext();   // <-- สำคัญ: ไปสเต็ปถัดไปทันทีหลังแอนิเมชันสั้น ๆ
        }, 2000);
      }
    } else {
      btn.classList.add('wrong');
      firstAttempt = false;
      setText(s.wrongMsg || 'Try again!', 'red');
      setTimeout(()=> btn.classList.remove('wrong'), 600);
    }
  });
});


checkBtn.addEventListener('click', ()=>{
  if (locked) return;
  const s = currentStep();
  if (!s.requiresInput) return;

  const val = userInputEl.value.trim().toUpperCase();
  if (!s.validate){
    setText('No validator defined for this step.', 'red');
    return;
  }
  const { ok, msg } = s.validate(ctx, val);
  if (!ok){
    setText(msg || 'Incorrect. Try again!', 'red');
    firstAttempt = false;
    return;
  }
  // ถูก
  awardIfFirstAttempt();
  setText('Awesome! Complementary strand synthesized.', 'green');
  if (s.onInputCorrect) s.onInputCorrect(ctx);
  awaitingInput = false;

  // ไปขั้นต่อไป
  goNext();
});

// กด Enter ในช่องกรอก = กด CHECK
userInputEl.addEventListener('keydown', e=>{
  if (e.key === 'Enter'){
    e.preventDefault();
    checkBtn.click();
  }
});
