'use strict';

(function () {
  function currentLevel() {
    return window.location.hash.replace(/^#/, '').toLowerCase() === 'goal' ? 'goal' : 'character';
  }

  window.writecraftNavigate = function writecraftNavigate(level) {
    const target = level === 'goal' ? 'goal' : 'character';
    const nextHash = `#${target}`;
    if (window.location.hash === nextHash) {
      window.location.reload();
      return;
    }
    window.location.hash = target;
    window.location.reload();
  };

  const level = currentLevel();
  document.documentElement.dataset.level = level;
  document.title = level === 'goal'
    ? 'WriteCraft — Level 2: Goal'
    : 'WriteCraft — Level 1: Character';

  const script = document.createElement('script');
  script.src = level === 'goal' ? 'goal.js' : 'character.js';
  script.defer = true;
  document.body.appendChild(script);
})();
