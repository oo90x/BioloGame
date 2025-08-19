export const MAX_SCORE = 3;
export const START_IMAGE = "../image/transcription_start.jpg";

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
  { id: "modification", name: "5' cap & poly A-tail & Splicing", img: "../image/modification2.png" },
  { id:"amylase", name:"Amylase", img:"../image/amylase.png" },

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
    correctId: 'Transcription_Factor',
    idleMsg: 'Choose an enzyme to proceed...',
    okMsg: 'Great! we noticed the promoter.',
    wrongMsg: 'Silly you! I dont know where to start.',
    image: '../image/transcription_03.jpg'
  },

  {
    id: 2,
    correctId: 'RNA_Polymerase',
    idleMsg: 'Lets start the transcription.',
    okMsg: 'Nice! the DNA strands are now separated.',
    wrongMsg: 'Your DNA is still double helix; you cannot proceed the replication like this!',

    onCorrect(ctx) {
      
      ctx.setSequence(
        ['../image/transcription_04.jpg','../image/transcription_06.jpg','../image/transcription_07.jpg','../image/transcription_08.jpg', '../image/transcription_09.jpg'],
        [0,700,1400,2100,2800]
      );
    }
  },

  {
    id: 3,
    correctId: 'modification',
    idleMsg: 'Something seems off, may be it requires some modifications?',
    okMsg: "'5' cap and poly A-tail are added ofc spliced.",
    wrongMsg: 'No modification yet.',

    onCorrect(ctx) {
      
      ctx.setSequence(
        ['../image/transcription_09.jpg','../image/transcription_10.jpg','../image/transcription_11.jpg','../image/transcription_12.jpg'],
        [0,1000,2000,3000]
      );
    }

  },

  {
    id: 4,
    correctId: 'primase',
    idleMsg: 'Finished, mRNA is ready to be translated.',
    okMsg: 'Good! Primers are in. Time to add nucleotides!',
    wrongMsg: 'Seems like your enzymes do not know where to begin???',
    image: '../image/primase.jpg'
  },

  // 🔸 ขั้นพิเศษ: ต้องกรอก ATCG
  {
    id: 5,
    correctId: 'dna_pol_iii',
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
