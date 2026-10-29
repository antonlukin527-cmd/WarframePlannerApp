function switchTab(id, btn){
  document.querySelectorAll('.main-tabs .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}

function switchInnerTab(id, btn){
  document.querySelectorAll('.inner-tabs .itab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.itab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('itab-' + id).classList.add('active');
}