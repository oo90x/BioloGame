(function(){
  // ค่า default ถ้ายังไม่เคยมี
  const rawScore = localStorage.getItem('replicationScore');
  const rawMax   = localStorage.getItem('replicationMax');

  const score = Number.isFinite(+rawScore) ? +rawScore : 0;
  const max   = Number.isFinite(+rawMax)   ? +rawMax   : 8;

  const badge = document.getElementById('scoreBadge');
  badge.textContent = `${score}/${max}`;
})();
