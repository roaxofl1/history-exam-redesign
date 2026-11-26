import React from 'react';
import '../styles/home.css';

/**
 * 한국사능력검정시험 인트로(Home) 화면.
 * 기존 App/라우터는 수정하지 않습니다. 실제 프로젝트의 경로는 links prop으로 연결하세요.
 * 2025년 시험 일정은 디자인 시안용 과거 예시이며, 현재 공식 일정이 아닙니다.
 */
const SAMPLE_EXAMS = [
  {
    round: '제73회 한국사능력검정시험',
    rows: [
      { icon: 'calendar', label: '시험일', value: '2025. 04. 26. (토)' },
      { icon: 'edit', label: '원서접수', value: '2025. 03. 04. (화) 10:00 ~ 03. 11. (화) 18:00' },
      { icon: 'check', label: '결과 발표', value: '2025. 05. 16. (금) 10:00' },
    ],
  },
  {
    round: '제74회 한국사능력검정시험',
    rows: [
      { icon: 'calendar', label: '시험일', value: '2025. 07. 26. (토)' },
      { icon: 'edit', label: '원서접수', value: '2025. 06. 03. (화) 10:00 ~ 06. 10. (화) 18:00' },
    ],
  },
];

// 사이트에 실제 경로가 준비되면 links prop의 값을 교체합니다.
const DEFAULT_LINKS = {
  login: '/login',
  signup: '/signup',
  apply: '/exam/apply',
  ticket: '/ticket',
  results: '/results',
  certificate: '/certificate',
  allServices: '/main',
};

const ACTIONS = [
  { key: 'apply', title: '원서접수' },
  { key: 'ticket', title: '수험표 출력' },
  { key: 'results', title: '시험 결과 조회' },
  { key: 'certificate', title: '인증서 출력' },
];

function ServiceIcon({ name, className = '' }) {
  const shared = {
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const drawings = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3"/></>,
    edit: <><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="m11 13 9-9a2.1 2.1 0 0 1 3 3l-9 9-4 1z"/></>,
    printer: <><path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6zM18 12h.01"/></>,
    search: <><circle cx="10.8" cy="10.8" r="7.1"/><path d="m16.2 16.2 5.1 5.1"/></>,
    certificate: <><path d="M5 2h10l4 4v8M15 2v4h4M5 2v20h8"/><path d="M8 10h8M8 14h5"/><circle cx="17.2" cy="18" r="3.1"/><path d="m15.6 20.6-.4 2.4 2-1.2 2 1.2-.4-2.4"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  };
  return <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...shared}>{drawings[name]}</svg>;
}

function HeritageBackground() {
  // 2개 이미지를 이어 붙여 첫 번째 이미지 너비만큼 이동하면 끊김 없이 반복됩니다.
  return (
    <div className="home-heritage" aria-hidden="true">
      <div className="home-heritage__track">
        <img src={`${import.meta.env.BASE_URL}images/home/heritage-strip.png`} alt="" draggable="false" />
        <img src={`${import.meta.env.BASE_URL}images/home/heritage-strip.png`} alt="" draggable="false" />
      </div>
    </div>
  );
}

function IntroHeader({ links }) {
  return (
    <header className="home-header home-inner">
      <div className="home-header__brand" aria-label="국사편찬위원회 한국사능력검정시험">
        <img
src={`${import.meta.env.BASE_URL}images/home/history-exam-logo.png`}
  alt="한국사능력검정시험"
/>
      </div>
      <nav aria-label="회원 메뉴" className="home-header__account">
        <a href={links.login}>로그인</a>
        <span aria-hidden="true">|</span>
        <a href={links.signup}>회원가입</a>
      </nav>
    </header>
  );
}

function ExamScheduleRow({ icon, label, value }) {
  return (
    <div className="home-schedule__row">
      <div className="home-schedule__label"><ServiceIcon name={icon} /><span>{label}</span></div>
      <span className="home-schedule__value">{value}</span>
    </div>
  );
}

function ExamSchedule({ exams }) {
  return (
    <section className="home-schedule" aria-label="시험 일정 안내">
      {exams.map((exam, index) => (
        <div className="home-schedule__exam" key={exam.round}>
          <div className="home-schedule__heading">
            <h2>{exam.round}</h2>
            {exam.status && <span className="home-schedule__badge">{exam.status}</span>}
          </div>
          <div className="home-schedule__rows">
            {exam.rows.map((row) => <ExamScheduleRow key={row.label} {...row} />)}
          </div>
          {index < exams.length - 1 && <hr className="home-schedule__divider" />}
        </div>
      ))}
    </section>
  );
}

// 동일한 네모 박스 안에서 각 행 전체가 클릭되는 주요 기능 메뉴.
// 아이콘은 사용자가 제공한 '외부로 이동' 형태의 선형 SVG를 사용합니다.
function QuickActionItem({ item, href }) {
  return (
    <a className="home-action" href={href} aria-label={item.title}>
      <span className="home-action__label">{item.title}</span>
      <svg className="home-action__external" viewBox="0 0 32 32" aria-hidden="true"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5H7a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-8" />
        <path d="M17 3h12v12M29 3 14 18" />
      </svg>
    </a>
  );
}

function QuickActionGrid({ links }) {
  return (
    <nav className="home-quick" aria-label="자주 이용하는 서비스">
      <div className="home-quick__list">
        {ACTIONS.map((item) => <QuickActionItem key={item.key} item={item} href={links[item.key]} />)}
      </div>
      <a className="home-quick__all" href={links.allServices}>
        <span>전체 서비스 보기</span><span aria-hidden="true">→</span>
      </a>
    </nav>
  );
}

export default function Home({ links = {}, exams = SAMPLE_EXAMS }) {
  const mergedLinks = { ...DEFAULT_LINKS, ...links };
  return (
    <div className="home-intro">
      <HeritageBackground />
      <a className="home-skip" href="#home-content">본문 바로가기</a>
      <IntroHeader links={mergedLinks} />
      <main className="home-main home-inner" id="home-content">
        <ExamSchedule exams={exams} />
        <QuickActionGrid links={mergedLinks} />
      </main>
    </div>
  );
}
