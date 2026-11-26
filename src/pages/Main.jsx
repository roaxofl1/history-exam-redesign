import React, { useState } from 'react';
import '../styles/main.css';

// 메인 메뉴의 2DEPTH 구조. 하위 페이지는 아직 제작되지 않았으므로
// 실제 경로가 준비되면 href를 프로젝트 라우트에 맞춰 연결하세요.
const MENU_GROUPS = [
  {
    title: '시험 정보',
    items: [
      { label: '시험 소개', href: '/exam/about' },
      { label: '시험 일정', href: '/exam/schedule' },
      { label: '응시 규정', href: '/exam/rules' },
      { label: '시험장 현황', href: '/exam/locations' },
    ],
  },
  {
    title: '시험 자료',
    items: [
      { label: '기출문제', href: '/resources/questions' },
      { label: '정답 보기', href: '/resources/answers' },
      { label: '문항 이의 신청', href: '/resources/appeals' },
    ],
  },
  {
    title: '알림·지원',
    items: [
      { label: '공지사항', href: '/support/notices' },
      { label: '자주 묻는 질문', href: '/support/faq' },
      { label: '각종 서식', href: '/support/forms' },
      { label: '문의 안내', href: '/support/contact' },
    ],
  },
  {
    title: '마이페이지',
    items: [
      { label: '나의 시험 정보', href: '/mypage/exams' },
      { label: '인증서 관리', href: '/mypage/certificates' },
      { label: '회원정보 관리', href: '/mypage/profile' },
    ],
  },
];

export default function Main({
  loginHref = '/login',
  signupHref = '/signup',
  homeHref = '/',
  menuGroups = MENU_GROUPS,
  onNavigate, // 선택: 아직 없는 하위 페이지 이동을 앱에서 직접 처리할 때 사용
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [pendingPage, setPendingPage] = useState('');

  function handleItemClick(event, item) {
    if (item.href === "/exam/schedule") {
  return;
}
    if (onNavigate) {
      event.preventDefault();
      onNavigate(item);
      return;
    }
    // 이 미리보기에는 하위 페이지가 없으므로 잘못된 URL로 이동하지 않습니다.
    event.preventDefault();
    setPendingPage(item.label);
  }

return (
  <div className="history-main">

    
<div className="history-main__mobile-brand">
  <a href={homeHref} aria-label="인트로 홈으로 돌아가기">
src={`${import.meta.env.BASE_URL}images/home/history-exam-logo.png`}
  </a>

  <nav className="history-main__mobile-account" aria-label="모바일 계정 메뉴">
    <a href={loginHref}>로그인</a>
    <a href={signupHref}>회원가입</a>
  </nav>
</div>


    {/* 제공된 원본 사진을 수정 없이 그대로 사용합니다. */}
    <div className="history-main__visual" aria-hidden="true">
 <img
  src={`${import.meta.env.BASE_URL}images/main/palace-arch.png`}
  alt=""
  draggable="false"
/>

  <div className="history-main__watermark">
    <p className="history-main__watermark-title">韓國史</p>
    <p className="history-main__watermark-sub">지난 세월을 읽는 오늘의 눈</p>
  </div>
</div>

      <a className="history-main__skip" href="#history-main-menu">메뉴 바로가기</a>

      <aside className="history-main__panel" aria-label="전체 서비스 메뉴">
        <div className="history-main__panel-inner" id="history-main-menu">
          <header className="history-main__header">
            <a className="history-main__logo" href={homeHref} aria-label="인트로 홈으로 돌아가기">
              <img
  src={`${import.meta.env.BASE_URL}images/home/history-exam-logo.png`}
  alt="국사편찬위원회 한국사능력검정시험"
/>
            </a>
            <nav className="history-main__account" aria-label="계정 메뉴">
  <a href={loginHref}>로그인</a>
  <a href={signupHref}>회원가입</a>
</nav>
          </header>
          {/* 시험 일정: 왼쪽 메뉴 패널 내부 */}

<div className="history-main__schedule">
  <p className="history-main__schedule-title">
    제81회 한국사능력검정시험
    <span className="history-main__schedule-badge">심화</span>
  </p>

  <dl className="history-main__schedule-dates">
    <div>
      <dt>시험일</dt>
      <dd>2026.11.28.(토) 10:00</dd>
    </div>
    <div>
      <dt>원서접수</dt>
      <dd>11.03. ~ 11.10.</dd>
    </div>
    <div>
      <dt>수험표 출력</dt>
      <dd>11.24. 10:00~</dd>
    </div>
    <div>
      <dt>결과 발표</dt>
      <dd>12.11.(금) 10:00</dd>
    </div>
  </dl>

 
<div className="history-main__schedule-actions">
  <a
    className="history-main__schedule-button"
    href="/exam/schedule"
  >
    전체 시험 일정 보기
  </a>

  <a
    className="history-main__schedule-button"
    href="/exam/apply"
  >
    원서접수
  </a>
</div>

</div>

          <nav
  className="history-main__nav"
  aria-label="한국사능력검정시험 전체 메뉴"
  onMouseLeave={() => setActiveIndex(null)}
>
            {menuGroups.map((group, index) => {
              const expanded = activeIndex === index;
              const panelId = `history-main-submenu-${index}`;
              return (
                <section
  className="history-main__group"
  key={group.title}
  onMouseEnter={() => {
    setActiveIndex(index);
    setPendingPage('');
  }}
>
                  <h2 className="history-main__group-title">
                    <button
                      type="button"
                      className="history-main__trigger"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => { setActiveIndex(expanded ? null : index); setPendingPage(''); }}
                    >
                      {group.title}
                    </button>
                  </h2>

<div
  className={`history-main__submenu${expanded ? ' is-open' : ''}`}
  id={panelId}
  aria-hidden={!expanded}
  inert={!expanded}
>
  <div className="history-main__submenu-inner">
    {group.items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        onClick={(event) => handleItemClick(event, item)}
      >
        {item.label}
      </a>
    ))}
  </div>
</div>

                </section>
              );
            })}
          </nav>
          {pendingPage && (
            <p className="history-main__notice" role="status">
              ‘{pendingPage}’ 페이지는 아직 제작 전이야. 현재는 Main 시안 미리보기야.
            </p>
          )}
          <footer className="history-main__footer">
  <p>한국사능력검정시험 · 웹사이트 리디자인</p>
  
</footer>
        </div>
      </aside>
    </div>
  );
}
