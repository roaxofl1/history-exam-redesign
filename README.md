# 한국사능력검정시험 Home + Main 미리보기

## 실행 (Windows PowerShell)

```powershell
npm.cmd install
npm.cmd run dev
```

- `http://localhost:5173/` — 기존 인트로(Home)
- `http://localhost:5173/main` — 새 Main 화면
- Home의 **전체 서비스 보기** 버튼을 누르면 Main으로 이동합니다.
- 사진 파일은 **사용자가 제공한 원본 그대로** `public/images/main/palace-arch.png`에 복사했습니다.
- 이전 Home의 확정 수정사항(전체 세로 중앙 정렬, 버튼 높이 60px)을 포함했습니다.
- `src/pages/Main.jsx`, `src/styles/main.css`를 별도로 추가했습니다.
- Main의 서브메뉴는 아코디언으로 작동합니다. 서브페이지, 로그인/회원가입 페이지는 아직 구현되지 않았습니다. 하위 메뉴 클릭 시 미구현 안내를 표시합니다.
- 이 프로젝트는 기존 사용자의 로컬 파일을 직접 수정한 것이 아닌, 이 대화에서 이전에 제작한 Home ZIP을 바탕으로 확장한 **새 미리보기 프로젝트**입니다. 실제 로컬 프로젝트에 적용할 경우 Main 관련 파일·사진만 복사하고 현재 App 라우터에서 `/main`만 연결하세요.
