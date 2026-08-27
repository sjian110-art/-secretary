import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * 페이지 이동 시 스크롤 위치를 제어하는 커스텀 훅.
 * 브라우저 자동 스크롤 복원을 비활성화하고, 일반적인 이동(PUSH, REPLACE) 시 최상단으로 스크롤합니다.
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // 브라우저의 자동 스크롤 복원이 동작하지 않도록 처리
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 뒤로가기(POP)나 새로고침을 제외한 일반적인 페이지 이동(PUSH, REPLACE)에서는 최상단에서 시작
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);
};

export default useScrollToTop;
