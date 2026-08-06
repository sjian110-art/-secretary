document.addEventListener('DOMContentLoaded', () => {
  initWaterButton();
  initSproutButton();
  initBottomNav();
  initNotification();
});

function initWaterButton() {
  const waterButton = document.querySelector('#water-btn');
  const faucetButton = document.querySelector('#faucet-btn');
  if (!waterButton || !faucetButton) return;

  const runWaterAction = () => {
    if (faucetButton.classList.contains('is-running')) return;
    waterButton.classList.add('water-btn--active');
    waterButton.disabled = true;
    faucetButton.disabled = true;
    faucetButton.classList.add('is-running');

    window.setTimeout(() => {
      waterButton.classList.remove('water-btn--active');
      waterButton.disabled = false;
      faucetButton.disabled = false;
      faucetButton.classList.remove('is-running');
    }, 1600);
  };

  waterButton.addEventListener('click', runWaterAction);
  faucetButton.addEventListener('click', runWaterAction);
}

function initSproutButton() {
  const sproutButton = document.querySelector('#sprout-btn');
  if (!sproutButton) return;

  sproutButton.addEventListener('click', () => {
    sproutButton.classList.remove('is-bouncing');
    void sproutButton.offsetWidth;
    sproutButton.classList.add('is-bouncing');
  });
  sproutButton.addEventListener('animationend', () => {
    sproutButton.classList.remove('is-bouncing');
  });
}

function initBottomNav() {
  const navItems = [...document.querySelectorAll('.nav-item')];
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
}

function initNotification() {
  document.querySelector('#notification-btn')?.addEventListener('click', () => {
    window.alert('새로운 알림이 없습니다.');
  });
}
