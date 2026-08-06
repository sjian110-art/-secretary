document.addEventListener('DOMContentLoaded', () => {
  const missionItems = [...document.querySelectorAll('.mission-item')];
  const saveButton = document.querySelector('#btn-save-today');
  const notificationButton = document.querySelector('#notification-btn');
  const navItems = [...document.querySelectorAll('.nav-item')];

  missionItems.forEach((item) => {
    const checkButton = item.querySelector('.mission-check');
    checkButton?.addEventListener('click', () => {
      const isDone = item.classList.toggle('is-done');
      checkButton.setAttribute('aria-pressed', String(isDone));
    });
  });

  saveButton?.addEventListener('click', () => {
    const completedCount = missionItems.filter((item) => item.classList.contains('is-done')).length;
    const label = saveButton.querySelector('.save-label');
    const originalLabel = label?.textContent || '오늘의 저금';

    if (label) label.textContent = `오늘의 저금 완료 · 미션 ${completedCount}/${missionItems.length}`;
    saveButton.disabled = true;

    window.setTimeout(() => {
      if (label) label.textContent = originalLabel;
      saveButton.disabled = false;
    }, 1800);
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((navItem) => {
        navItem.classList.remove('active');
        navItem.removeAttribute('aria-current');
      });
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    });
  });

  notificationButton?.addEventListener('click', () => {
    window.alert('새로운 알림이 없습니다.');
  });
});
