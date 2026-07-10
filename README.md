# 기술 블로그

Notion을 CMS로 사용하는 기술 블로그입니다. Next.js App Router에서 글 목록과
상세 페이지를 생성하고, 같은 저장소에서 이력서와 포트폴리오 공개 채널도 함께
운영합니다.

## 배포 주소

| 채널        | 주소                                                             |
| ----------- | ---------------------------------------------------------------- |
| 기술 블로그 | [youngzin-log.com](https://youngzin-log.com)                     |
| 이력서      | [resume.youngzin-log.com](https://resume.youngzin-log.com)       |
| 포트폴리오  | [portfolio.youngzin-log.com](https://portfolio.youngzin-log.com) |

## 프로젝트 구조

```text
app/
├── (site)/                 # 블로그 공통 레이아웃과 글 라우트
├── portfolio/              # 포트폴리오 목록·상세 라우트
├── resume/                 # 이력서 라우트
├── layout.tsx              # 전역 메타데이터와 Google Analytics
└── sitemap.ts              # 공개 콘텐츠 기반 사이트맵
src/
├── apis/notion.ts          # Notion 조회와 공개 데이터 선별
├── components/shared/      # 공용 UI와 Notion renderer
├── types/                  # 글·포트폴리오 도메인 타입
└── utils/
    ├── data-format.ts      # ExtendedRecordMap 데이터 변환
    └── routes.ts           # 내부 경로와 공개 URL 구성
proxy.ts                    # 커리어 서브도메인 rewrite
```

## 주요 기술 선택

| 기술                    | 선택 이유                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Next.js 16 · React 19   | App Router의 서버 렌더링, Metadata API, 재검증 기능을 한 흐름에서 사용하기 위해 선택했습니다. |
| Notion · react-notion-x | 별도 관리자 화면 없이 글을 작성하고 Notion 블록 표현을 웹에 재사용하기 위해 선택했습니다.     |
| TypeScript              | Notion의 비정형 응답을 글과 포트폴리오 도메인 타입으로 안전하게 변환하기 위해 사용합니다.     |
| Tailwind CSS 4          | 전역 디자인 토큰을 유지하면서 화면별 스타일을 컴포넌트 가까이에서 관리하기 위해 사용합니다.   |
| Vercel                  | App Router와 ISR 기반 배포 흐름을 별도 인프라 구성 없이 운영하기 위해 사용합니다.             |

## 환경 변수 관리

실제 값이 들어 있는 `.env` 파일은 저장소에서 추적하지 않습니다. 사용되는 변수명과
공개 여부는 [`.env.example`](./.env.example)에 명시하고, 배포 환경의 값은 Vercel
환경 변수로 관리합니다.
