/* ─── SKILL PROFICIENCY TOOLTIPS ─────────────── */
(function () {
  document.querySelectorAll('.sk-item[data-proficiency]').forEach(function (item) {
    var pct = parseInt(item.getAttribute('data-proficiency'), 10);

    var tip = document.createElement('div');
    tip.className = 'sk-prof-tip';

    var label = document.createElement('span');
    label.className = 'sk-prof-label';
    label.textContent = 'Proficiency';

    var pctEl = document.createElement('span');
    pctEl.className = 'sk-prof-pct';
    pctEl.textContent = pct + '%';

    var barBg = document.createElement('div');
    barBg.className = 'sk-prof-bar-bg';

    var barFill = document.createElement('div');
    barFill.className = 'sk-prof-bar-fill';
    barFill.style.setProperty('--prof-width', pct + '%');

    barBg.appendChild(barFill);
    tip.appendChild(label);
    tip.appendChild(pctEl);
    tip.appendChild(barBg);
    item.appendChild(tip);
  });
})();
