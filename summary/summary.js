(function(){
  // ค่า default ถ้ายังไม่เคยมี
  const rawScore_replication = localStorage.getItem('replicationScore');
  const rawMax_replication   = localStorage.getItem('replicationMax');
  const rawScore_transcription = localStorage.getItem('transcriptionScore');
  const rawMax_transcription   = localStorage.getItem('transcriptionMax');
  const rawScore_translation = localStorage.getItem('translationScore');
  const rawMax_translation   = localStorage.getItem('translationMax');

  const score_replication = Number.isFinite(+rawScore_replication) ? +rawScore_replication : 0;
  const max_replication   = Number.isFinite(+rawMax_replication)   ? +rawMax_replication   : 8;
  const score_transcription = Number.isFinite(+rawScore_transcription) ? +rawScore_transcription : 0;
  const max_transcription   = Number.isFinite(+rawMax_transcription)   ? +rawMax_transcription   : 3;
  const score_translation = Number.isFinite(+rawScore_translation) ? +rawScore_translation : 0;
  const max_translation   = Number.isFinite(+rawMax_translation)   ? +rawMax_translation   : 8;

  const badge_replication = document.getElementById('scoreBadge_replication');
  badge_replication.textContent = `${score_replication}/${max_replication}`;
  const badge_transcription = document.getElementById('scoreBadge_transcription');
  badge_transcription.textContent = `${score_transcription}/${max_transcription}`;
  const badge_translation = document.getElementById('scoreBadge_translation');
  badge_translation.textContent = `${score_translation}/${max_translation}`;
})();
