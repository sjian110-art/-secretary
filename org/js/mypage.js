/* ============================================
   mypage.js
   마이페이지 전용 스크립트
   ============================================ */

/**
 * 프로필 편집 버튼 이벤트 초기화
 * 연필 버튼 클릭 시 콘솔 출력 (실제 편집 기능 미구현)
 */
function initProfileEdit() {
  const btnEdit = qs('#btn-profile-edit');
  if (!btnEdit) return;

  btnEdit.addEventListener('click', () => {
    console.log('프로필 편집 클릭');
    // TODO: 프로필 편집 화면으로 이동 또는 모달 오픈
  });
}

/**
 * 메뉴 클릭 이벤트 초기화
 * 각 메뉴 아이템에 클릭 로그 추가
 */
function initMenuEvents() {
  const menuItems = qsa('.menu-item');
  if (!menuItems.length) return;

  menuItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const menuId = item.id;
      console.log(`메뉴 클릭: ${menuId}`);

      if (menuId === 'menu-secretary' || menuId === 'menu-room') {
        e.preventDefault();
        window.alert('준비 중인 기능입니다.');
      }
    });
  });
}

/**
 * 알림 버튼 이벤트
 */
function initNotificationBtn() {
  const btn = qs('#notification-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    console.log('알림 버튼 클릭');
  });
}

/**
 * 하단 탭바 마이페이지 활성화
 * common.js의 initBottomNav()가 이미 클릭 이벤트를 처리하므로
 * 진입 시 마이페이지 탭을 활성 상태로 설정한다.
 */
function initActiveTab() {
  const navItems = qsa('.bottom-nav .nav-item');
  if (!navItems.length) return;

  // 모두 비활성화 후 마이페이지만 활성화
  navItems.forEach((item) => item.classList.remove('active'));

  const mypageTab = qs('#tab-mypage');
  if (mypageTab) mypageTab.classList.add('active');
}

/* ---- DOM 로드 완료 후 초기화 ---- */
document.addEventListener('DOMContentLoaded', () => {
  initProfileEdit();
  initMenuEvents();
  initNotificationBtn();
  initActiveTab();
});
