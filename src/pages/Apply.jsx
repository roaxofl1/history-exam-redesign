
import { useState, useEffect } from "react";
import "../styles/schedule.css";
import "../styles/apply.css";

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

const STEPS = [
  "시험 선택",
  "시험장 선택",
  "응시 정보",
  "최종 확인",
];

// 시험장 선택 UI를 구현하기 위한 임시 데이터
const CENTERS = {
  경기: ["시험장 A", "시험장 B"],
  서울: ["시험장 C", "시험장 D"],
  인천: ["시험장 E", "시험장 F"],
};

function ApplyHeader({ onUnavailable }) {
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
                aria-label={`${menu.title} 하위 메뉴 보기`}
                onClick={() => setActiveMenu(index)}
              >
                {menu.title}
              </button>
            </div>
          ))}

          <div className="schedule-nav__mega">
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
                    href={href}
                    key={href}
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
          className="schedule-header__mobile"
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "닫기" : "메뉴"}
        </button>
      </div>
    </header>
  );
}

export default function Apply() {
  const [step, setStep] = useState(0);
  const [examType, setExamType] = useState("심화");
  const [region, setRegion] = useState("경기");
  const [center, setCenter] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
  if (!notice) return;

  const timer = setTimeout(() => {
    setNotice("");
  }, 3000);

  return () => clearTimeout(timer);
}, [notice]);
const [applicant, setApplicant] = useState({
  name: "",
  birth: "",
  phone: "",
  email: "",
});

const [photo, setPhoto] = useState(null);
const [photoPreview, setPhotoPreview] = useState("");
const [completed, setCompleted] = useState(false);

function updateApplicant(field, value) {
  setApplicant((prev) => ({
    ...prev,
    [field]: value,
  }));
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    setNotice("JPG 또는 PNG 파일을 선택해 주세요.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setNotice("5MB 이하의 사진을 선택해 주세요.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setPhoto(file);
    setPhotoPreview(reader.result);
  };

  reader.readAsDataURL(file);
}
  return (
    <div className="schedule-page apply-page">
      <ApplyHeader onUnavailable={setNotice} />

        <main className="apply-content">
  {!completed ? (
    <>
      <div className="schedule-breadcrumb">
          <a href="/main">HOME</a>
          <span>/</span>
          <strong>원서접수</strong>
        </div>

        <div className="apply-heading">
          <h1>원서접수</h1>
        </div>

        <nav className="apply-steps" aria-label="원서접수 단계">
          {STEPS.map((title, index) => (
            <div
              className={`apply-step ${
                index === step ? "is-active" : ""
              } ${index < step ? "is-complete" : ""}`}
              key={title}
              aria-current={index === step ? "step" : undefined}
            >
              <span className="apply-step__bar" />
              <span className="apply-step__label">
                {String(index + 1).padStart(2, "0")}
                <span>{title}</span>
              </span>
            </div>
          ))}
        </nav>

        {step === 0 && (
          <section className="apply-section">
            <div className="apply-section__heading">
              <h2>응시할 시험을 선택하세요.</h2>
              <p>시험 회차와 응시 유형을 확인해 주세요.</p>
            </div>

            <div className="apply-exam-card">
              <div className="apply-exam-card__top">
                <div>
                  <p className="apply-caption">다음 시험</p>
                  <h3>제82회 한국사능력검정시험</h3>
                  <p className="apply-exam-card__date">
                    2027.02.13. (토)
                  </p>
                </div>
                <span className="apply-status">접수 예정</span>
              </div>

              <div className="apply-exam-card__divider" />

              <fieldset className="apply-type">
                <legend>시험 종류</legend>

                <label className="apply-type__option">
                  <input
                    type="radio"
                    name="examType"
                    value="심화"
                    checked={examType === "심화"}
                    onChange={() => setExamType("심화")}
                  />
                  <span>심화</span>
                </label>

                <label className="apply-type__option is-disabled">
                  <input
                    type="radio"
                    name="examType"
                    value="기본"
                    disabled
                  />
                  <span>기본 (해당 회차 미시행)</span>
                </label>
              </fieldset>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="apply-section">
            <div className="apply-section__heading">
              <h2>응시 지역과 시험장을 선택하세요.</h2>
              <p>응시할 지역을 선택한 후 시험장을 확인해 주세요.</p>
            </div>

            <div className="apply-exam-card">
              <div className="apply-field">
                <label htmlFor="apply-region">응시 지역</label>
                <select
                  id="apply-region"
                  value={region}
                  onChange={(event) => {
                    setRegion(event.target.value);
                    setCenter("");
                  }}
                >
                  {Object.keys(CENTERS).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>


<div className="apply-field">
  <label htmlFor="apply-center">시험장 선택</label>

  <select
    id="apply-center"
    value={center}
    onChange={(event) => setCenter(event.target.value)}
  >
    <option value="" disabled>
      시험장을 선택해 주세요
    </option>

    {CENTERS[region].map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
</div>

            </div>
          </section>
        )}


{/* STEP 03 — 응시 정보 */}
{step === 2 && (
  <section className="apply-section">
    <div className="apply-section__heading">
      <h2>응시 정보를 입력해 주세요.</h2>
      <p>응시자 정보와 증명사진을 등록해 주세요.</p>
    </div>

    <div className="apply-exam-card">
      <div className="apply-form">


<div className="apply-photo">

  <div className="apply-photo__preview">
    {photoPreview ? (
      <img
        src={photoPreview}
        alt="등록한 증명사진 미리보기"
      />
    ) : (
      <span>사진 미리보기</span>
    )}
  </div>

  <div className="apply-photo__details">
    <h3>증명사진 등록</h3>
    <p>JPG, PNG 파일 / 최대 5MB</p>

    <label
      className="apply-photo__upload"
      htmlFor="applicant-photo"
    >
      사진 선택
    </label>

    <input
      id="applicant-photo"
      type="file"
      accept="image/jpeg,image/png"
      onChange={handlePhotoChange}
      className="apply-photo__input"
    />

    {photo && (
      <p className="apply-photo__filename">
        {photo.name}
      </p>
    )}
  </div>

                {/* 여기에 유의사항 배치 */}
  <div className="apply-photo__notice">
    <h4>사진 등록 유의사항</h4>
    <ul>
      <li>본인 얼굴이 선명하게 식별되는 사진을 등록해 주세요.</li>
      <li>모자, 선글라스 등으로 얼굴을 가린 사진은 사용할 수 없습니다.</li>
      <li>단체사진, 전신사진, 비율이 맞지 않는 사진은 피해주세요.</li>
    </ul>
  </div>

</div>

{/* 오른쪽: 응시 정보 입력 */}
<div className="apply-form__fields">
          <div className="apply-field">
            <label htmlFor="applicant-name">
              이름 <span className="apply-required">*</span>
            </label>
            <input
              id="applicant-name"
              type="text"
              autoComplete="name"
              maxLength={30}
              placeholder="이름을 입력해 주세요"
              value={applicant.name}
              onChange={(e) =>
                updateApplicant("name", e.target.value)
              }
            />
          </div>

          <div className="apply-field">
            <label htmlFor="applicant-birth">
              생년월일 <span className="apply-required">*</span>
            </label>
            <input
              id="applicant-birth"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="YYYYMMDD"
              value={applicant.birth}
              onChange={(e) =>
                updateApplicant(
                  "birth",
                  e.target.value.replace(/\D/g, "")
                )
              }
            />
          </div>

          <div className="apply-field">
            <label htmlFor="applicant-phone">
              휴대전화 <span className="apply-required">*</span>
            </label>
            <input
              id="applicant-phone"
              type="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
              value={applicant.phone}
              onChange={(e) =>
                updateApplicant("phone", e.target.value)
              }
            />
          </div>

          <div className="apply-field">
            <label htmlFor="applicant-email">
              이메일 <span className="apply-required">*</span>
            </label>
            <input
              id="applicant-email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={applicant.email}
              onChange={(e) =>
                updateApplicant("email", e.target.value)
              }
       
            />
          </div>
        </div>

      </div>
    </div>
  </section>
)}


{/* STEP 04 — 최종 확인 */}
{step === 3 && !completed && (
  <section className="apply-section">
    <div className="apply-section__heading">
      <h2>접수 정보를 확인해 주세요.</h2>
      <p>입력한 정보가 정확한지 최종 확인해 주세요.</p>
    </div>

    <div className="apply-exam-card">
      <h3 className="apply-confirm__title">시험 정보</h3>

      <dl className="apply-confirm__list">
        <div>
          <dt>시험 회차</dt>
          <dd>제82회 한국사능력검정시험</dd>
        </div>
        <div>
          <dt>시험일</dt>
          <dd>2027.02.13. (토)</dd>
        </div>
        <div>
          <dt>시험 종류</dt>
          <dd>{examType}</dd>
        </div>
        <div>
          <dt>응시 지역</dt>
          <dd>{region}</dd>
        </div>
        <div>
          <dt>시험장</dt>
          <dd>{center}</dd>
        </div>
      </dl>

      <div className="apply-exam-card__divider" />

      <h3 className="apply-confirm__title">응시자 정보</h3>

      <dl className="apply-confirm__list">
        <div>
          <dt>이름</dt>
          <dd>{applicant.name}</dd>
        </div>
        <div>
          <dt>생년월일</dt>
          <dd>{applicant.birth}</dd>
        </div>
        <div>
          <dt>휴대전화</dt>
          <dd>{applicant.phone}</dd>
        </div>
        <div>
          <dt>이메일</dt>
          <dd>{applicant.email}</dd>
        </div>
        <div>
          <dt>증명사진</dt>
          <dd>{photo?.name}</dd>
        </div>
      </dl>
    </div>
  </section>
)}


<div className="apply-actions">
  <button
    type="button"
    className="apply-button apply-button--outline"
    disabled={step === 0}
    onClick={() => {
      setNotice("");
      setStep((prev) => Math.max(0, prev - 1));
    }}
  >
    이전 단계
  </button>

  <button
    type="button"
    className="apply-button apply-button--primary"
    onClick={() => {
      if (step === 0) {
        setStep(1);
        return;
      }

      if (step === 1) {
        if (!center) {
          setNotice("시험장을 선택해 주세요.");
          return;
        }

        setStep(2);
        return;
      }

      if (step === 2) {
        const { name, birth, phone, email } = applicant;

        if (
          !name.trim() ||
          !birth.trim() ||
          !phone.trim() ||
          !email.trim()
        ) {
          setNotice("필수 정보를 모두 입력해 주세요.");
          return;
        }

        const birthMatch =
          /^(\d{4})(\d{2})(\d{2})$/.exec(birth);
        const birthDate = birthMatch
          ? new Date(
              Number(birthMatch[1]),
              Number(birthMatch[2]) - 1,
              Number(birthMatch[3])
            )
          : null;

        if (
          !birthDate ||
          birthDate.getFullYear() !== Number(birthMatch[1]) ||
          birthDate.getMonth() !== Number(birthMatch[2]) - 1 ||
          birthDate.getDate() !== Number(birthMatch[3])
        ) {
          setNotice("생년월일을 YYYYMMDD 형식으로 입력해 주세요.");
          return;
        }

        if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone)) {
          setNotice("휴대전화 번호를 확인해 주세요.");
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setNotice("이메일 주소를 확인해 주세요.");
          return;
        }

        if (!photo) {
          setNotice("증명사진을 등록해 주세요.");
          return;
        }

        setStep(3);
        return;
      }

      if (step === 3) {
  setNotice("");
  setCompleted(true);
}
    }}
  >
    {step === 3 ? "접수 완료" : "다음 단계"}
    {step !== 3 && <span aria-hidden="true">→</span>}

    </button>
  </div>

    </>
  ) : (
    <section className="apply-complete">
      <div className="apply-complete__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M12 24.5 21 33l15-18"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1>원서접수가 완료되었습니다.</h1>

      <div className="apply-complete__summary">
        <dl className="apply-confirm__list">
          <div>
            <dt>시험 회차</dt>
            <dd>제82회 한국사능력검정시험</dd>
          </div>
          <div>
            <dt>시험일</dt>
            <dd>2027.02.13. (토)</dd>
          </div>
          <div>
            <dt>시험 종류</dt>
            <dd>{examType}</dd>
          </div>
          <div>
            <dt>응시 지역</dt>
            <dd>{region}</dd>
          </div>
          <div>
            <dt>시험장</dt>
            <dd>{center}</dd>
          </div>
        </dl>
      </div>

      <div className="apply-complete__actions">
        <a
          href="/exam/schedule"
          className="apply-button apply-button--outline"
        >
          시험 일정 보기
        </a>

        <a
          href="/main"
          className="apply-button apply-button--primary"
        >
          메인으로
        </a>
      </div>
    </section>
  )}
</main>

<footer className="schedule-footer">

        <span>한국사능력검정시험</span>
        <span>포트폴리오 리디자인 시안</span>
      </footer>

      {notice && (
        <div className="schedule-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
