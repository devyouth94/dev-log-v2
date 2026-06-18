- **description**
  - 개발 아티클 작성을 위한 기술 블로그 사이트
- **experience**
  - Notion 연동
    - `ISR`을 사용하여 재빌드 없이 최신 상태 유지
    - `React Notion X`를 사용하여 노션 작성시 블로그와 동기화
  - SEO 최적화
    - `Next Seo`를 사용한 SEO 최적화
    - `Next API Routes`를 사용한 `sitemap.xml` 동적 생성
    - `GA` 및 `Goole Search Console` 등록
  - `Vercel` 배포
- **tech stack**
  `Next` `TypeScript` `Zustand` `Tailwind CSS`

## Development

This project uses `pnpm` as its package manager.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Spotify refresh token

Use the local script when a new `SPOTIFY_REFRESH_TOKEN` is needed.

```bash
pnpm spotify:token
```

The script loads `.env` and `.env.local`, then uses `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, and optional `SPOTIFY_REDIRECT_URI`. The redirected page
can fail to load because the callback route is not part of the app; paste the
final URL from the browser address bar into the script.
