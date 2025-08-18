// Read catalog saved by the shop page
const catalog = JSON.parse(localStorage.getItem('enzymesCatalog') || '[]');
const byId = Object.fromEntries(catalog.map(e => [e.id, e]));

// Stage 1 buttons (match your mockup order)
const STAGE_ENZYMES = JSON.parse(localStorage.getItem('selectedEnzymes') || '[]');
//       // TODO: move
// Render enzyme buttons with picture icons
const actions = document.getElementById('actions');
actions.innerHTML = STAGE_ENZYMES.map(id => {
  const e = byId[id] || { name: id, color: '#ccc' };
  const icon = e.img
    ? `<span class="icon-dot"><img src="${e.img}" alt="${e.name}"></span>`
    : `<span class="icon-dot" style="background:${e.color || '#ccc'}"></span>`;
  return `<button class="enzyme-btn" data-id="${id}">${icon}<span>${e.name}</span></button>`;
}).join('');

let currentStep = 1;
let templateDNA = '';
let score = 0;
let firstAttempt = true;

const instructions   = document.getElementById('game-instructions');
const imageEl        = document.getElementById('dna-image');
const inputBox       = document.getElementById('input-container');
const randomDNABox   = document.getElementById('random-dna-container');
const userInputEl    = document.getElementById('user-input');
const checkBtn       = document.getElementById('check-btn');
const textChoose     = document.getElementById('text-choose');
const plusOneEl = document.getElementById('plusOne');



function generateRandomDNA(len = 6){
  const bases = ['A','T','C','G'];
  let s = '';
  for (let i=0;i<len;i++) s += bases[Math.floor(Math.random()*bases.length)];
  return s;
}
function compBase(b){
  if (b==='A') return 'T';
  if (b==='T') return 'A';
  if (b==='C') return 'G';
  if (b==='G') return 'C';
  return '';
}

function setImageSequence(paths, delays){
  // simple small animation sequence
  paths.forEach((src, i) => setTimeout(() => { imageEl.src = src; }, delays[i] || 0));
}
function expectedEnzymeId(step){
  switch (step) {
    case 1: return 'topoisomerase';
    case 2: return 'helicase';
    case 3: return 'SSB_Protein';
    case 4: return 'primase';
    case 5: return 'dna_pol_iii'; 
    case 6: return 'dna_pol_i';
    case 7: return 'ligase';
    default: return null;
  }
}
function flash(btn, ok){
  if (ok) {
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    setTimeout(()=>btn.classList.remove('wrong'), 1000);
  }
}
const DELAY_OK_MS = 1000;


let awaitingComplement = false;

function chooseEnzyme(enzymeId){
  switch (currentStep) {
    case 1: 
      if (enzymeId === 'topoisomerase') {
        instructions.textContent = 'Great! DNA is relaxing…'; instructions.style.color = 'green';
        setImageSequence(
          ['../image/topo1.jpg','../image/topo2.jpg','../image/topo3.jpg','../image/topo4.jpg','../image/uncoiledDNA.jpg'],
          [0,400,800,1200,1700]
        );
        setStep(2);
      } else {
        instructions.textContent = 'Silly you! DNA is still super coiled.'; instructions.style.color = 'red';
      }
      break;

    case 2: 
      if (enzymeId === 'helicase') {
        instructions.textContent = 'Well done! Helicase opened the strands.'; instructions.style.color = 'green';
        imageEl.src = '../image/helicase.jpg';
        setStep(3);
      } else {
        instructions.textContent = 'Your DNA is still double helix; you cannot proceed the replication like this!'; instructions.style.color = 'red';
      }
      break;

    case 3: 
      if (enzymeId === 'SSB_Protein') {
        instructions.textContent = 'Nice! SSB keeps strands apart.'; instructions.style.color = 'green';
        imageEl.src = '../image/ssb.jpg';
        setStep(4);
      } else {
        instructions.textContent = 'Your DNA strands are rejoining. Try another enzyme.'; instructions.style.color = 'red';
      }
      break;

    case 4: 
      if (enzymeId === 'primase') {
        instructions.textContent = 'Good! Primers are in. Time to add nucleotides!'; instructions.style.color = 'green';
        imageEl.src = '../image/primase.jpg';
        setStep(5);

      } 
      else {
        instructions.textContent = 'Seems like your enzymes do not know where to begin???'; instructions.style.color = 'red';
      }
      break;

    case 5: // waiting for user to type complement (handled by CHECK button)
      if (enzymeId === 'dna_pol_iii' && !awaitingComplement) {
        firstAttempt = true;
        textChoose.classList.add('hidden');
        imageEl.src = '../image/dnapol3.jpg';
        instructions.textContent = 'Enter the complementary strand and press CHECK.'; instructions.style.color = 'green';
        templateDNA = generateRandomDNA(6);
        randomDNABox.textContent = `Template Strand: ${templateDNA}`;
        userInputEl.value = '';
        inputBox.classList.remove('hidden');
        awaitingComplement = true; 
        
      } 
      else {
        instructions.textContent =  'The strands are not complete yet! Please replicate them.'; instructions.style.color = 'red';
      }
     break;

    case 6: 
      if (enzymeId === 'dna_pol_i') {
        instructions.textContent = 'Great! DNA Polymerase I replaced primers.'; instructions.style.color = 'green';
        imageEl.src = '../image/dnapol1.jpg';
        setStep(7);
      } else {
        instructions.textContent =  'There is still something a little bit off on the replicated sides. Maybe replace something?'; instructions.style.color = 'red';
      }
      break;

    case 7: 
      if (enzymeId === 'ligase') {
        setStep(8);
        instructions.textContent = 'Congrats! Ligase sealed the gaps!'; instructions.style.color = 'green';
        imageEl.src = '../image/ligase.jpg';
        textChoose.classList.add('hidden');


        setTimeout(() => {
          instructions.textContent = 'You finished the game! Refresh to play again.'; instructions.style.color = 'green';
          imageEl.src = '../image/ligase.jpg';
          imageEl.src = '../image/DNA-finish.jpg';
        }, 3000);
        
      } else {
        instructions.textContent = 'The gaps have not been sealed!!'; instructions.style.color = 'red';
      }
      break;
    case 8:
      instructions.textContent = 'You finished the game! Refresh to play again.'; instructions.style.color = 'green';
      imageEl.src = '../image/ligase.jpg';
      imageEl.src = '../image/DNA-finish.jpg';
        


  }
}


function setStep(n){
  currentStep = n;
  firstAttempt = true;
}
function updateScoreUI(){
  const el = document.getElementById('scoreVal');
  if (el) el.textContent = score; // กัน null
}
function showPlusOne(){
  plusOneEl.classList.add('show');
  setTimeout(()=> plusOneEl.classList.remove('show'), 3000); // โชว์ 3 วิ
}

function awardIfFirstAttempt(){
  if (firstAttempt){
    score += 1;
    updateScoreUI();
    showPlusOne();
    firstAttempt = false;  

    localStorage.setItem('replicationScore', String(score));
    localStorage.setItem('replicationMax', '8');
  }
}
updateScoreUI();


// hook up buttons
actions.querySelectorAll('.enzyme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');

    if (currentStep === 5 && awaitingComplement) {
      // instructions.textContent = 'Enter the complementary strand and press CHECK.';instructions.style.color = 'green';
      return; // ไม่ทำอะไรต่อ
    }
    
    const expected = expectedEnzymeId(currentStep);
    const isCorrect = (currentStep === 5) ? (id === 'dna_pol_iii') : (id === expected);

    if(currentStep === 8){
      return;
    }
    if (isCorrect) {
      btn.classList.add('correct');
      awardIfFirstAttempt();
      // if (currentStep !== 5) awardIfFirstAttempt();
      setTimeout(() => {
        chooseEnzyme(id);
        btn.classList.remove('correct');
      }, DELAY_OK_MS); 
    } else {
      flash(btn, false);
      firstAttempt = false; 
      chooseEnzyme(id);
    }
  });
});


function handleCheck() {
  if (currentStep !== 5 || !awaitingComplement) return;

  const input = userInputEl.value.trim().toUpperCase();
  if (!/^[ATCG]{6}$/.test(input)) {
    instructions.textContent = 'Use only A, T, C, G (length 6). Try again.';instructions.style.color = 'red';
    firstAttempt = false;
    return;
  }

  const correct = templateDNA.split('').map(compBase).join('');
  if (input === correct) {
    awardIfFirstAttempt();  
    instructions.textContent = 'Awesome! Complementary strand synthesized.'; instructions.style.color = 'green';
    imageEl.src = '../image/completestrand.jpg';
    inputBox.classList.add('hidden');   // ← ซ่อนอินพุตเมื่อถูก
    
    setStep(6);     
    if (textChoose) textChoose.classList.remove('hidden');  

  } else {
    instructions.textContent = 'Incorrect complementary strand. Try again!'; instructions.style.color = 'red';
    firstAttempt = false;
  }
}

checkBtn.addEventListener('click', handleCheck);

userInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkBtn.click();   // เรียก event click ของปุ่ม
  }
});