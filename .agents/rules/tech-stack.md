---
trigger: always_on
description: Tech stack rules for Next.js and Supabase project
---

---
trigger: always_on
glob: "**/*.{ts,tsx,js,jsx}"
description: Tech stack rules for Next.js and Supabase project
---
# Tech Stack Rules
This project uses Next.js (App Router), Supabase, Tailwind CSS, and TypeScript. Adhere to the following rules for consistency and security.
## [Next.js (App Router)](https://nextjs.org/docs)
- **Server Components First**: Prefer React Server Components (RSC) by default. Use `"use client"` only for interactive elements or when using hooks (state, effects).
- **File-based Routing**: Follow the App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Data Fetching**: Fetch data in Server Components where possible to keep logic on the server. Use `fetch` with Next.js caching options or Supabase Server Client.
## [Supabase](https://supabase.com/docs)
- **Row Level Security (RLS)**: **CRITICAL.** Every table must have RLS enabled. Policies must be granularly defined (SELECT, INSERT, UPDATE, DELETE).
- **Authentication**: Use Supabase Auth for all user management. Use `@supabase/ssr` for managing sessions in Next.js.
- **Service Role Key**: **NEVER** expose the `service_role` key on the client side. Only use it in Server Components or Server Actions when bypassing RLS is absolutely necessary and safe.
## Migration
- ** Folder Location ** : supabase/migrations
- 마이그레이션을 수정하거나 삭제하거나 새로 생성할 때는 항상 사용자의 허가 받기
## [Data Validation & Types](https://zod.dev)
- **Zod**: Use Zod for all runtime data validation (API responses, Form submissions, environment variables).
- **TypeScript**: Strictly type all functions, props, and API responses. Avoid `any`.
## [Styling](https://tailwindcss.com/docs)
- **Tailwind CSS**: Use utility classes for all styling. Follow the "Rich Aesthetics" guidelines (glassmorphism, vibrant colors, smooth transitions).
- **Responsive Design**: Always use responsive prefixes (`sm:`, `md:`, `lg:`) to ensure mobile-first design.
## [Clean Architecture]
- Refer to `architecture.md` for folder structure and layering. Ensure separation of concerns between domain logic and presentation.
