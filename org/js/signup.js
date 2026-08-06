/* ============================================
   signup.js
   회원가입 화면 전용 스크립트
   ============================================ */

/**
 * '다음으로' 버튼 활성/비활성 상태를 갱신한다.
 * 이름, 이메일, 비밀번호가 모두 입력되어야 활성화된다.
 * @param {HTMLInputElement} inputName
 * @param {HTMLInputElement} inputEmail
 * @param {HTMLInputElement} inputPw
 * @param {HTMLButtonElement} btnNext
 */
function updateNextBtn(inputName, inputEmail, inputPw, btnNext) {
  const allFilled =
    inputName.value.trim().length > 0 &&
    inputEmail.value.trim().length > 0 &&
    inputPw.value.trim().length > 0;

  btnNext.disabled = !allFilled;
  btnNext.setAttribute('aria-disabled', String(!allFilled));
}

/**
 * 회원가입 폼 초기화
 * - 입력창 실시간 감지로 버튼 활성화
 * - 제출 시 console.log("Step 1 Complete")
 */
function initSignupForm() {
  const form       = qs('#signup-form');
  const inputName  = qs('#input-name');
  const inputEmail = qs('#input-email');
  const inputPw    = qs('#input-pw');
  const btnNext    = qs('#btn-next');

  if (!form) return;

  /* ---- 입력값 감지 → 버튼 활성화 ---- */
  const inputs = [inputName, inputEmail, inputPw];

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      updateNextBtn(inputName, inputEmail, inputPw, btnNext);
    });

    /* focus 시 테두리 초기화 (에러 스타일 제거) */
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
      input.style.backgroundColor = '';
      input.style.boxShadow = '';
    });
  });

  /* ---- 초기 상태 갱신 ---- */
  updateNextBtn(inputName, inputEmail, inputPw, btnNext);

  /* ---- 폼 제출 ---- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    /* 버튼이 비활성 상태면 동작하지 않음 */
    if (btnNext.disabled) return;

    console.log('Step 1 Complete');
    window.location.href = 'login.html';
  });
}

/* ---- DOM 로드 완료 후 초기화 ---- */
document.addEventListener('DOMContentLoaded', () => {
  initSignupForm();
});
