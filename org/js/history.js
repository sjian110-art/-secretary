document.addEventListener('DOMContentLoaded', () => {
  initMonthDropdown();
  initCategoryFilters();
  initFabButton();
  initBottomNav();
  initNotification();
});

function initMonthDropdown() {
  const dropdown = document.querySelector('#month-dropdown');
  const menu = document.querySelector('#month-menu');
  if (!dropdown || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    dropdown.setAttribute('aria-expanded', 'false');
  };

  dropdown.addEventListener('click', () => {
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    dropdown.setAttribute('aria-expanded', String(willOpen));
  });

  menu.querySelectorAll('[data-month]').forEach((option) => {
    option.addEventListener('click', () => {
      menu.querySelectorAll('[data-month]').forEach((item) => {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
      });
      option.classList.add('selected');
      option.setAttribute('aria-selected', 'true');
      dropdown.querySelector('span').textContent = `${option.dataset.month}월`;
      closeMenu();
      dropdown.focus();
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.month-selector')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initCategoryFilters() {
  const buttons = [...document.querySelectorAll('.filter-btn')];
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      const category = button.dataset.category;
      document.querySelectorAll('.transaction-card').forEach((card) => {
        card.classList.toggle('is-filtered', category !== 'all' && card.dataset.category !== category);
      });
      document.querySelectorAll('.date-group').forEach((group) => {
        group.hidden = !group.querySelector('.transaction-card:not(.is-filtered)');
      });
    });
  });
}

function initFabButton() {
  document.querySelector('#fab-add')?.addEventListener('click', () => {
    window.location.href = 'index_main.html';
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
