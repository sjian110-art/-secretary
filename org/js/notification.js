/* ============================================
   notification.js
   알림 화면 전용 스크립트
   ============================================ */

/**
 * '내역 확인' 버튼 이벤트
 */
function initHistoryBtn() {
  const btnHistory = qs('#btn-history');
  if (!btnHistory) return;

  btnHistory.addEventListener('click', () => {
    console.log('내역 확인');
    window.location.href = 'history.html';
  });
}

/**
 * '닫기' 버튼 이벤트
 * 클릭 시 첫 번째 카드가 fade-out 되며 사라짐
 */
function initCloseBtn() {
  const btnClose = qs('#btn-close-card');
  const budgetCard = qs('#noti-card-budget');
  if (!btnClose || !budgetCard) return;

  btnClose.addEventListener('click', () => {
    // noti-card--hidden 클래스 추가 → CSS transition으로 fade-out
    budgetCard.classList.add('noti-card--hidden');

    // transition 완료 후 DOM에서 완전히 숨김
    budgetCard.addEventListener('transitionend', () => {
      budgetCard.style.display = 'none';
    }, { once: true });
  });
}

/**
 * 하단 탭바 마이페이지 활성화
 */
function initActiveTab() {
  const navItems = qsa('.bottom-nav .nav-item');
  if (!navItems.length) return;

  navItems.forEach((item) => item.classList.remove('active'));

  const mypageTab = qs('#tab-mypage');
  if (mypageTab) mypageTab.classList.add('active');
}

/* ---- DOM 로드 완료 후 초기화 ---- */
document.addEventListener('DOMContentLoaded', () => {
  initHistoryBtn();
  initCloseBtn();
  initActiveTab();
});
