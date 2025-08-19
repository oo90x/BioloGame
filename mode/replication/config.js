export const MAX_SCORE = 8;

// ปุ่ม/ไอคอนที่ใช้ใน shop & track ด้านล่าง (รวมถึง id ที่ใช้ตอบ)
export const CATALOG = [
  { id: "topoisomerase", name: "Topoisomerase", img: "../image/Topoisomerase.png" },
  { id: "helicase",      name: "Helicase",      img: "../image/helicase.png" },
  { id: "SSB_Protein",   name: "SSB Protein",   img: "../image/SSB_Protein-fotor-bg-remover-20250811192919.png" },
  { id: "primase",       name: "Primase",       img: "../image/primase.png" },
  { id: "dna_pol_iii",   name: "DNA Polymerase III", img: "../image/DNA_pol_iii.png" },
  { id: "dna_pol_i",     name: "DNA Polymerase I",   img: "../image/DNA_pol_i.png" },
  { id: "ligase",        name: "Ligase",        img: "../image/ligase.png" },
  { id: "ribosome",      name: "Ribosome",      img: "../image/ribosome.png" },
  { id: "RNA_Polymerase", name: "RNA Polymerase", img: "../image/RNA_Polymerase.png" },
  { id: "Transcription_Factor", name: "Transcription Factor", img: "../image/Transcription_Factor.png" },
  { id: "tRNA", name: "tRNA", img: "../image/tRNA.png" },
  { id: "mRNA", name: "mRNA", img: "../image/mRNA.png" },

];




// ยูทิลของโหมดนี้
function complementBase(b){
  if (b==='A') return 'T';
  if (b==='T') return 'A';
  if (b==='C') return 'G';
  if (b==='G') return 'C';
  return '';
}
function genDNA(n=6){
  const B = ['A','T','C','G'];
  let s = '';
  for (let i=0;i<n;i++) s += B[Math.floor(Math.random()*B.length)];
  return s;
}

export const STEPS = [
  {
    id: 1,
    correctId: 'topoisomerase',
    idleMsg: 'Choose an enzyme to proceed...',
    okMsg: 'Great! DNA is relaxing…',
    wrongMsg: 'Silly you! DNA is still super coiled.',

    onCorrect(ctx) {
      
      ctx.setSequence(
        ['../image/topo1.jpg','../image/topo2.jpg','../image/topo3.jpg','../image/topo4.jpg','../image/uncoiledDNA.jpg'],
        [0,400,800,1200,1700]
      );
    }
  },

  {
    id: 2,
    correctId: 'helicase',
    idleMsg: 'Separate the DNA strands.',
    okMsg: 'Nice! the DNA strands are now separated.',
    wrongMsg: 'Your DNA is still double helix; you cannot proceed the replication like this!',
    image: '../image/helicase.jpg',
  },

  {
    id: 3,
    correctId: 'SSB_Protein',
    idleMsg: 'The DNA strands seems like rejoining try to do something first.',
    okMsg: 'Nice! SSB keeps strands apart.',
    wrongMsg: 'Your DNA strands are rejoining. Try another enzyme.',
    image: '../image/ssb.jpg'
  },

  {
    id: 4,
    correctId: 'primase',
    idleMsg: 'Enzymes are looking for a place to start.',
    okMsg: 'Good! Primers are in. Time to add nucleotides!',
    wrongMsg: 'Seems like your enzymes do not know where to begin???',
    image: '../image/primase.jpg'
  },

  // 🔸 ขั้นพิเศษ: ต้องกรอก ATCG
  {
    id: 5,
    correctId: 'dna_pol_iii',
    idleMsg: 'Time to add nucleotides!',
    okMsg: 'Good! adding complementary bases.',
    wrongMsg: 'The strands are not yet completed.',
    requiresInput: true,
    prompt: 'Enter the complementary strand and press CHECK.',
    // เรียกตอนเข้าสเต็ปนี้ (หลังตอบเอนไซม์ถูก)
    onEnter(ctx){
      ctx.image('../image/dnapol3.jpg');
      ctx.templateDNA = genDNA(6);
      ctx.randomDNABox.textContent = `Template Strand: ${ctx.templateDNA}`;
      ctx.userInput.value = '';
      ctx.inputBox.classList.remove('hidden');
    },
    // ตรวจคำตอบที่กรอก
    validate(ctx, input){
      const okPattern = /^[ATCG]{6}$/;
      if(!okPattern.test(input)) return { ok:false, msg:'Use only A, T, C, G (length 6). Try again!' };
      const correct = ctx.templateDNA.split('').map(complementBase).join('');
      if(input !== correct) return { ok:false, msg:'Incorrect complementary strand. Try again!' };
      return { ok:true };
    },
    // ถ้ากรอกถูก
    onInputCorrect(ctx){
      ctx.image('../image/completestrand.jpg');
      ctx.inputBox.classList.add('hidden');
    }
  },

  {
    id: 6,
    correctId: 'dna_pol_i',
    idleMsg: 'There are still some primers left in the strands.',
    okMsg: 'Great! DNA Polymerase I replaced primers.',
    wrongMsg: 'There is still something a little bit off on the replicated sides. Maybe replace something?',
    image: '../image/dnapol1.jpg'
  },
  {
    id: 7,
    correctId: 'ligase',
    idleMsg: 'Quick!, join those gaps',
    okMsg: 'Congrats! Ligase sealed the gaps!',
    wrongMsg: 'The gaps have not been sealed!!',
    image: '../image/ligase.jpg',
    onAfter(ctx){
      setTimeout(()=>{
        ctx.text('You finished the game! Refresh to play again.', 'green');
        ctx.image('../image/DNA-finish.jpg');
        ctx.lock(); // ล็อกเกม ไม่ให้กดต่อ
      }, 3000);
    }
  },
];
