
import { useState } from "react";
import "../styles/schedule.css";

/* 공식 발표된 시험 일정 */
const EXAMS = [
  {
    round: 81,
    date: "2026-11-28",
    type: "심화",
    apply: ["2026-11-03 10:00", "2026-11-10 17:00"],
    extra: ["2026-11-11 13:00", "2026-11-13 17:00"],
    result: "2026-12-11",
  },
  {
    round: 82,
    date: "2027-02-13",
    type: "심화",
    apply: ["2027-01-12 10:00", "2027-01-19 17:00"],
    extra: ["2027-01-26 10:00", "2027-01-29 17:00"],
    result: null,
  },
  {
    round: 83,
    date: "2027-05-23",
    type: "기본 · 심화",
    apply: ["2027-04-20 10:00", "2027-04-27 17:00"],
    extra: ["2027-05-04 10:00", "2027-05-07 17:00"],
    result: null,
  },
  {
    round: 84,
    date: "2027-08-07",
    type: "기본 · 심화",
    apply: ["2027-07-06 10:00", "2027-07-13 17:00"],
    extra: ["2027-07-20 10:00", "2027-07-23 17:00"],
    result: null,
  },
  {
    round: 85,
    date: "2027-10-16",
    type: "심화",
    apply: ["2027-09-06 10:00", "2027-09-13 17:00"],
    extra: ["2027-09-28 10:00", "2027-10-01 17:00"],
    result: null,
  },
  {
    round: 86,
    date: "2027-11-27",
    type: "심화",
    apply: ["2027-11-02 10:00", "2027-11-09 17:00"],
    extra: ["2027-11-10 13:00", "2027-11-12 17:00"],
    result: null,
  },
];

const MENUS = [
  {
    title: "시험 정보",
    items: [
      ["시험 소개", "/exam/about"],
      ["시험 일정", "/exam/schedule"],
      ["원서접수", "/exam/apply"],
      ["응시 규정", "/exam/rules"],
      ["시험장 현황", "/exam/locations"],
    ],
  },
  {
    title: "시험 자료",
    items: [
      ["기출문제", "/resources/questions"],
      ["정답 보기", "/resources/answers"],
      ["문항 이의 신청", "/resources/appeals"],
    ],
  },
  {
    title: "알림·지원",
    items: [
      ["공지사항", "/support/notices"],
      ["자주 묻는 질문", "/support/faq"],
      ["각종 서식", "/support/forms"],
      ["문의 안내", "/support/contact"],
    ],
  },
  {
    title: "마이페이지",
    items: [
      ["나의 시험 정보", "/mypage/exams"],
      ["인증서 관리", "/mypage/certificates"],
      ["회원정보 관리", "/mypage/profile"],
    ],
  },
];

const OFFICIAL_SCHEDULE =
  "https://www.historyexam.go.kr/pageLink.do?link=examSchedule";

const OFFICIAL_2027 =
  "https://www.historyexam.go.kr/pst/view.do?bbs=noti&pst_sno=1000030163";

/* 한국 시간 기준 날짜 처리 */
function koreanToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function koreanNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const value = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return (
    `${value.year}-${value.month}-${value.day} ` +
    `${value.hour}:${value.minute}`
  );
}

function formatDate(value) {
  if (!value) return "추후 공지";
  return value.replaceAll("-", ".");
}

function formatPeriod(period) {
  if (!period) return "추후 공지";
  return `${formatDate(period[0])} ~ ${formatDate(period[1])}`;
}

function weekday(date) {
  const [y, m, d] = date.split("-").map(Number);
  return ["일", "월", "화", "수", "목", "금", "토"][
    new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  ];
}

function getExamStatus(exam, now) {
  if (exam.result && now > `${exam.result} 23:59`) {
    return "전체 일정 종료";
  }

  if (now > `${exam.date} 23:59`) {
    return "결과 발표 대기";
  }

  if (now >= `${exam.date} 00:00`) {
    return "시험 시행일";
  }

  if (now >= exam.extra[0] && now <= exam.extra[1]) {
    return "취소좌석 접수 기간";
  }

  if (now >= exam.apply[0] && now <= exam.apply[1]) {
    return "정기접수 기간";
  }

  if (now > exam.apply[1]) {
    return "접수 종료";
  }

  return "접수 예정";
}

function getStepState(start, end, now) {
  if (now > end) return "completed";
  if (now >= start) return "active";
  return "upcoming";
}


function Header({ onUnavailable }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  function handleLink(event, label, href) {
    if (href !== "/exam/schedule" && href !== "/exam/apply") {
      event.preventDefault();
      onUnavailable(label);
    } else {
      setMobileOpen(false);
    }
  }

  return (
    <header className="schedule-header">
      <div className="schedule-header__inner">
        <a className="schedule-header__logo" href="/main">
         <img
  src={`${import.meta.env.BASE_URL}images/home/history-exam-logo.png`}
  alt="한국사능력검정시험"
/>
        </a>

        <nav
  className={`schedule-nav ${mobileOpen ? "is-open" : ""}`}
  aria-label="주요 메뉴"
  onMouseLeave={() => setActiveMenu(null)}
>
          {/* 1DEPTH: 상단 메뉴 */}
          {MENUS.map((menu, index) => (
            <div
  className="schedule-nav__group"
  key={menu.title}
  onMouseEnter={() => setActiveMenu(index)}
>
              <button
                type="button"
                className={`schedule-nav__trigger ${
  activeMenu === index ? "is-hovered" : ""
}`}
                aria-haspopup="true"
                aria-controls="schedule-mega-menu"
              >
                {menu.title}
              </button>
            </div>
          ))}

          {/* 2DEPTH: 네 개 메뉴가 한 번에 표시 */}
          <div
            id="schedule-mega-menu"
            className="schedule-nav__mega"
          >
            {MENUS.map((menu, index) => (
  <div
    className="schedule-nav__column"
    key={menu.title}
    onMouseEnter={() => setActiveMenu(index)}
  >
                <p className="schedule-nav__column-title">
                  {menu.title}
                </p>

                {menu.items.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    aria-current={
                      href === "/exam/schedule"
                        ? "page"
                        : undefined
                    }
                    onClick={(event) =>
                      handleLink(event, label, href)
                    }
                  >
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div className="schedule-header__account">
          <button
            type="button"
            onClick={() => onUnavailable("로그인")}
          >
            로그인
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => onUnavailable("회원가입")}
          >
            회원가입
          </button>
        </div>

        <button
          type="button"
          className="schedule-header__mobile"
          aria-label={
            mobileOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"
          }
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "닫기" : "메뉴"}
        </button>
      </div>
    </header>
  );
}


export default function Schedule() {
  const today = koreanToday();
  const now = koreanNow();

  /* 시험일이 지난 회차는 자동으로 제외 */
  const upcomingExams = EXAMS.filter(
    (exam) => exam.date >= today
  ).sort((a, b) => a.date.localeCompare(b.date));

  /* 가장 가까운 예정 시험을 기본 선택 */
  const [selectedRound, setSelectedRound] = useState(null);
  const [notice, setNotice] = useState("");


  const exam =
    upcomingExams.find(
      (item) => item.round === selectedRound
    ) ?? upcomingExams[0];

  
const steps = exam
  ? [
      {
        label: "정기 원서접수",
        detail: formatPeriod(exam.apply),
        state: getStepState(exam.apply[0], exam.apply[1], now),
      },
      {
        label: "취소좌석 접수",
        detail: formatPeriod(exam.extra),
        state: getStepState(exam.extra[0], exam.extra[1], now),
      },
      {
        label: "시험 시행",
        detail: `${formatDate(exam.date)}. (${weekday(exam.date)})`,
        state: getStepState(
          `${exam.date} 00:00`,
          `${exam.date} 23:59`,
          now
        ),
      },
      {
        label: "결과 발표",
        detail: formatDate(exam.result),
        state: exam.result
          ? getStepState(
              `${exam.result} 00:00`,
              `${exam.result} 23:59`,
              now
            )
          : "upcoming",
      },
    ]
  : [];


  return (
    <div className="schedule-page">
      <Header
  onUnavailable={(label) =>
    setNotice(`‘${label}’ 페이지는 아직 제작 전입니다.`)
  }
/>

      <main className="schedule-content">
        <div className="schedule-breadcrumb">
          <a href="/main">HOME</a>
          <span>/</span>
          <span>시험 정보</span>
          <span>/</span>
          <strong>시험 일정</strong>
        </div>

        <div className="schedule-heading">
          <div>
            <h1>한국사능력검정시험 일정</h1>
          </div>
          <span className="schedule-year">
            {upcomingExams.length
              ? [...new Set(
                  upcomingExams.map((item) =>
                    item.date.slice(0, 4)
                  )
                )].join(" · ") + "년"
              : "일정 안내"}
          </span>
        </div>

        <section className="schedule-section">
          <div className="schedule-section__heading">
            <h2>시험 회차 선택</h2>
            <p>가까운 예정 시험부터 표시됩니다.</p>
          </div>

          {upcomingExams.length > 0 ? (
            <div className="schedule-rounds">
              {upcomingExams.map((item) => {
                const selected = exam.round === item.round;

                return (
                  <button
                    type="button"
                    key={item.round}
                    className={
                      "schedule-round " +
                      (selected ? "is-selected" : "")
                    }
                    aria-pressed={selected}
                    onClick={() => setSelectedRound(item.round)}
                  >
                    <span className="schedule-round__number">
  제{item.round}회
</span>
<span className="schedule-round__year">
  {item.date.slice(0, 4)}년
</span>
<strong className="schedule-round__date">
  {`${item.date.slice(5, 7)}월 ${item.date.slice(8, 10)}일`}
</strong>
                    
<span className="schedule-round__type">
  {item.type}
</span>

<span
  className={`schedule-round__status ${
    getExamStatus(item, now) === "정기접수 기간" ||
    getExamStatus(item, now) === "취소좌석 접수 기간"
      ? "is-recruiting"
      : ""
  }`}
>
  {getExamStatus(item, now) === "정기접수 기간" ||
   getExamStatus(item, now) === "취소좌석 접수 기간"
    ? "접수 중"
    : getExamStatus(item, now) === "접수 예정"
    ? "접수 예정"
    : "접수 종료"}
</span>

                  </button>
                );
              })}
            </div>
          ) : (
            <div className="schedule-empty">
              현재 등록된 예정 시험이 없습니다.
              새로운 시험 일정이 발표되면 업데이트됩니다.
            </div>
          )}
        </section>

        {exam && (
          <section className="schedule-detail">
            <div className="schedule-detail__top">
              <div>
                <p className="schedule-eyebrow">
                  SELECTED EXAM
                </p>
                <h2>
                  제{exam.round}회 한국사능력검정시험
                </h2>

<div className="schedule-detail__date-row">
  <p className="schedule-detail__date">
    {formatDate(exam.date)}. ({weekday(exam.date)})
  </p>

  <span className="schedule-status">
    {getExamStatus(exam, now)}
  </span>
</div>

              </div>
<div className="schedule-detail__badges">
  <span className="schedule-type">
    {exam.type}
  </span>
</div>
            </div>

            <div className="schedule-progress">
              <div className="schedule-section__heading">
                <h3>시험 진행 단계</h3>
                <p>접수부터 결과 발표까지</p>
              </div>

              <ol className="schedule-progress__list">
                {steps.map((step, index) => (
                  <li
                    key={step.label}
                    className={
                      "schedule-progress__item is-" + step.state
                    }
                  >
                    <span className="schedule-progress__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong>{step.label}</strong>
      

{index < 2 ? (
  <>
    <span className="schedule-progress__desktop-date">
      <span>
        시작 {formatDate(index === 0 ? exam.apply[0] : exam.extra[0])}
      </span>
      <span>
        종료 {formatDate(index === 0 ? exam.apply[1] : exam.extra[1])}
      </span>
    </span>

<span className="schedule-progress__mobile-date">
  <span>
    시작 {formatDate((index === 0 ? exam.apply[0] : exam.extra[0]).split(" ")[0])}
  </span>
  <span>
    종료 {formatDate((index === 0 ? exam.apply[1] : exam.extra[1]).split(" ")[0])}
  </span>
</span>

  </>
) : (
  <span>{step.detail}</span>
)}

                  </li>
                ))}
              </ol>
            </div>

            <div className="schedule-detail__bottom">
              <p>
                시행 일정은 변경될 수 있습니다.
                정확한 정보는 공식 공지를 확인해 주세요.
              </p>
            
<button
  type="button"
  onClick={() => {
    const current = koreanNow();

    const regularOpen =
      current >= exam.apply[0] &&
      current <= exam.apply[1];

    const extraOpen =
      current >= exam.extra[0] &&
      current <= exam.extra[1];

    if (!regularOpen && !extraOpen) {
      setNotice("원서접수 기간이 아닙니다.");
      return;
    }

    if (exam.round !== 82) {
      setNotice("선택한 회차의 접수 화면은 아직 준비되지 않았습니다.");
      return;
    }

    window.location.href = "/exam/apply";
  }}
>
  원서접수
</button>

            </div>
          </section>
        )}
      </main>

      <footer className="schedule-footer">
        <span>한국사능력검정시험</span>
        <span>포트폴리오 리디자인 시안</span>
      </footer>

    
{notice && (
  <div className="schedule-dialog-backdrop">
    <div
      className="schedule-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="schedule-dialog-title"
      aria-describedby="schedule-dialog-message"
    >
      <div className="schedule-dialog__icon" aria-hidden="true">
        i
      </div>

      <h2 id="schedule-dialog-title">
        원서접수 안내
      </h2>

      <p id="schedule-dialog-message">
        {notice}
      </p>

      <button
        type="button"
        className="schedule-dialog__confirm"
        autoFocus
        onClick={() => setNotice("")}
      >
        확인
      </button>
    </div>
  </div>
)}

    </div>
  );
}
