/* ============================================
   login.js
   로그인 화면 전용 스크립트
   ============================================ */

/**
 * 에러 메시지를 표시하고 입력 필드에 에러 스타일을 적용한다.
 * @param {HTMLInputElement} inputEl - 대상 input 요소
 * @param {HTMLElement} errorEl     - 에러 메시지 표시 요소
 * @param {string} message          - 표시할 에러 메시지
 */
function showError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.style.borderColor = '#E05555';
  inputEl.style.backgroundColor = '#FFF5F5';
  inputEl.style.boxShadow = '0 0 0 3px rgba(224, 85, 85, 0.12)';
}

/**
 * 에러 상태를 초기화한다.
 * @param {HTMLInputElement} inputEl - 대상 input 요소
 * @param {HTMLElement} errorEl     - 에러 메시지 표시 요소
 */
function clearError(inputEl, errorEl) {
  errorEl.textContent = '';
  inputEl.style.borderColor = '';
  inputEl.style.backgroundColor = '';
  inputEl.style.boxShadow = '';
}

/**
 * 로그인 폼 초기화
 * - 제출 시 유효성 검사
 * - 빈 값이면 경고 표시
 * - 모두 입력되면 콘솔에 Login Success 출력
 */
function initLoginForm() {
  const form    = qs('#login-form');
  const inputId = qs('#input-id');
  const inputPw = qs('#input-pw');
  const errorId = qs('#error-id');
  const errorPw = qs('#error-pw');

  if (!form) return;

  /* ---- input 포커스 시 에러 초기화 ---- */
  inputId.addEventListener('focus', () => clearError(inputId, errorId));
  inputPw.addEventListener('focus', () => clearError(inputPw, errorPw));

  /* ---- input 입력 시 실시간 에러 초기화 ---- */
  inputId.addEventListener('input', () => {
    if (inputId.value.trim()) clearError(inputId, errorId);
  });
  inputPw.addEventListener('input', () => {
    if (inputPw.value.trim()) clearError(inputPw, errorPw);
  });

  /* ---- 폼 제출 ---- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const idVal = inputId.value.trim();
    const pwVal = inputPw.value.trim();

    let hasError = false;

    /* 아이디 유효성 검사 */
    if (!idVal) {
      showError(inputId, errorId, '아이디를 입력해주세요.');
      hasError = true;
    } else {
      clearError(inputId, errorId);
    }

    /* 비밀번호 유효성 검사 */
    if (!pwVal) {
      showError(inputPw, errorPw, '비밀번호를 입력해주세요.');
      hasError = true;
    } else {
      clearError(inputPw, errorPw);
    }

    /* 모두 입력된 경우 */
    if (!hasError) {
      console.log('Login Success');
      window.location.href = 'index_home.html';
    }
  });
}

/* ---- DOM 로드 완료 후 초기화 ---- */
document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
});
