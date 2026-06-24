# Repository Guidelines

## 프로젝트 구조 및 모듈 구성

이 레포지토리는 Next.js App Router를 사용하며 라우트, 메타데이터, 로딩 화면은 `app/` 하위에 위치합니다. 블로그 상세 페이지는 `app/post/[slug]/`에 있고, 전역 스타일과 폰트 선언은 `app/globals.css`와 `app/fonts/`에서 한 번만 정의합니다. 공용 UI는 `src/components`에 정리되어 있으며 `ui`는 기본 컴포넌트, `shared`는 레이아웃 조각을 담당합니다. 커스텀 훅, 타입 정의, 유틸 함수는 각각 `src/hooks`, `src/types`, `src/utils`에 위치하며, Notion 연동과 데이터 후처리는 `src/apis/notion.ts`와 `src/utils` 모듈에서 이루어집니다.

## 빌드·테스트·개발 명령

- `pnpm install` — `pnpm-lock.yaml`에 고정된 의존성을 설치합니다.
- `pnpm dev` — 핫 리로드가 적용된 Next.js 개발 서버를 실행합니다.
- `pnpm build` — Vercel 배포에 사용되는 프로덕션 번들을 생성합니다.
- `pnpm start` — 빌드 결과물을 로컬에서 스모크 테스트합니다.
- `pnpm lint` — Next.js와 ESLint 규칙으로 코드 품질을 검사합니다.

## 코딩 스타일 및 네이밍

모든 신규 파일은 TypeScript를 사용합니다. 컴포넌트, 유틸리티, 훅 파일명은 `post-title.tsx`, `class-name.ts`, `use-window-size.ts`처럼 케밥 케이스를 유지하고, 내보내는 컴포넌트 식별자는 `PostTitle`처럼 PascalCase를 사용합니다. 훅 함수는 `use` 접두사를 붙입니다. Prettier는 2스페이스 들여쓰기, 80자 라인 폭, 후행 쉼표, Tailwind 클래스 정렬을 강제하므로 커밋 전 포매팅을 수행하세요. Tailwind CSS는 v4 구성 방식을 따르며 `app/globals.css`에서 `@theme`로 토큰을 선언하므로 해당 파일을 통해 색상·간격·애니메이션을 조정하세요. ESLint는 Next.js와 TypeScript 안전 규칙, `import type { Foo }` 패턴을 중심으로 최소 설정을 유지합니다.

## 테스트 가이드라인

공용 테스트 러너가 아직 없으므로 모든 PR은 최소한 `pnpm lint`를 통과하고 `pnpm dev`에서 핵심 흐름을 수동 검증해야 합니다. 복잡한 로직이 늘어나면 인접한 `*.test.ts(x)`나 `src/__tests__`에 Jest/Vitest 테스트를 추가하고 PR에 임시 `pnpm test` 명령을 기록하세요. `src/utils`와 같은 순수 함수 모듈의 커버리지를 우선시하고 새로운 UI는 렌더 스모크 테스트로 확인하세요.

## 커밋 및 PR 원칙

기존 히스토리와 동일하게 Conventional Commits 포맷(`fix: …`, `refactor: …`, `chore: …`)을 사용하며, 요약은 짧고 명령형으로 작성합니다. PR 설명에는 관련 이슈를 `Closes #12` 형식으로 연결하고, 변경 요약과 함께 UI 수정 시 스크린샷 또는 짧은 영상을 첨부하세요. 실행한 명령을 명확히 적어 리뷰어 확인을 돕습니다.

## Notion 연동 및 컨텐츠 동기화

콘텐츠는 `src/utils/constants.ts`에 정의된 Notion 페이지 ID를 기준으로 로드됩니다. 새 데이터베이스를 연결할 때는 `NOTION_PAGE_IDS.post` 값을 갱신하고 대상 페이지가 공개 상태인지 확인하세요. 콘텐츠를 변경했다면 `pnpm build`로 ISR 결과를 검증하고 `app/sitemap.ts`가 예상 경로를 생성하는지 확인합니다.

## 에이전트 커뮤니케이션

별도 요청이 없으면 에이전트는 모든 질의에 한국어로 응답합니다. 다른 언어가 필요하다면 명시적으로 알려주세요.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `devyouth94/dev-log-v2`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: read root `CONTEXT.md` and `docs/adr/` when present. See `docs/agents/domain.md`.
