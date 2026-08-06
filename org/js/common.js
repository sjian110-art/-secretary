/* ============================================
   common.js
   공통 스크립트 (유틸리티 함수, 공통 컴포넌트 이벤트)
   ============================================ */

/**
 * QuerySelector 단축 함수
 * @param {string} selector - CSS 선택자
 * @param {HTMLElement|Document} [scope=document] - 검색 범위
 * @returns {HTMLElement|null}
 */
function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * QuerySelectorAll 단축 함수
 * @param {string} selector - CSS 선택자
 * @param {HTMLElement|Document} [scope=document] - 검색 범위
 * @returns {NodeListOf<HTMLElement>}
 */
function qsa(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

/**
 * 하단 네비게이션 탭바의 활성화 상태 변경 이벤트 설정
 */
function initBottomNav() {
  const navItems = qsa('.bottom-nav .nav-item');
  if (!navItems.length) return;

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// DOM 로드가 완료되면 공통 이벤트를 초기화한다.
document.addEventListener('DOMContentLoaded', () => {
  initBottomNav();
});
