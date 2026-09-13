# BookFinder

가입 없이 Open Library로 전 세계 원서를 검색하는 웹앱입니다. Google 로그인은 책을 찜할 때만 필요합니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포 URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-...` |
| `NEXT_PUBLIC_ADSENSE_SLOT_BANNER` | 띠 배너 슬롯 (승인 후) |
| `NEXT_PUBLIC_ADSENSE_SLOT_INLINE` | 검색 인라인 슬롯 |
| `NEXT_PUBLIC_ADSENSE_SLOT_DETAIL` | 상세 하단 슬롯 |
| `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` | 만 18세 이후 Associates 가입 시 |

## Google 로그인 설정 (한 번만)

1. Supabase Dashboard → **SQL Editor** → `supabase/schema.sql` 전체 실행
2. **Authentication → Providers → Google** 활성화 후 Google Client ID / Secret 붙여넣기
3. Google Cloud Console → 해당 OAuth 클라이언트:
   - Authorized JavaScript origins: `http://localhost:3000`, 배포 URL
   - Authorized redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Supabase **Authentication → URL Configuration**
   - Site URL: 배포 URL (로컬은 `http://localhost:3000`)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://your-domain/auth/callback`

## 배포 (Vercel)

GitHub 레포를 Vercel Import 한 뒤, 위 환경 변수를 Production에 등록합니다. `SUPABASE_SERVICE_ROLE_KEY` 와 Google Client Secret은 Vercel/Next 앱에 넣지 마세요. Secret은 Supabase Google provider에만 넣습니다.

## 페이지

- `/` 검색 + 주제 카드
- `/search` 결과 + 인라인 광고 자리
- `/book/OL…W` 상세, Amazon 가격 확인, 찜
- `/login` Google 로그인
- `/library` 내 서재
- `/about` 출처 안내
