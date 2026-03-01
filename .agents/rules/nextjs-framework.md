---
trigger: always_on
---

---
trigger: always_on
description: Next.js 프레임워크 관련 개발 규칙
---
# Next.js Framework Rules
Next.js 프로젝트의 일관성, 성능 및 유지보수성을 위해 다음 규칙을 준수합니다.
## 1. Server Components 선호 (Default to Server Components)
- 모든 컴포넌트는 기본적으로 **Server Component**로 작성합니다.
- `use client`는 interactivity(onClick, useState, useEffect 등)가 필요하거나 브라우저 API를 직접 사용하는 경우에만 최소한으로 사용합니다.
- Client Component 내에서도 데이터 페칭은 가급적 Server Component에서 수행하여 prop으로 전달합니다.
## 2. 간결하고 읽기 쉬운 코드 (Concise & Readable Code)
- 복잡한 로직은 서술적인 함수명을 사용하여 추상화합니다.
- 불필요한 추상화나 오버엔지니어링을 지양하고 의도가 명확한 코드를 작성합니다.
- 변수와 함수명은 해당 역할이 명확히 드러나도록 명명합니다.
## 3. 코드베이스 모듈화 (Modularity)
- 하나의 파일이 너무 커지거나(약 200~300라인 이상) 책임이 많아질 경우 여러 파일로 분리합니다.
- 공통 비즈니스 로직은 `hooks`나 `utils`로, UI 구성 요소는 `components`로 분리하여 재사용성을 높입니다.
## 4. 라우팅 및 파일 구조 (Routing & Structure)
- **Route Groups**: 논리적 구분을 위해 `(group)` 폴더를 활용하여 라우트를 구조화합니다.
- **Special Files**: 사용자 경험 향상을 위해 `loading.tsx`, `error.tsx`, `not-found.tsx`를 적극적으로 활용합니다.
## 5. 데이터 페칭 및 검증 (Data Fetching & Validation)
- 서버 측에서 데이터를 페칭할 때는 **Zod**와 같은 라이브러리를 사용하여 스키마를 검증하고 타입 안정성을 확보합니다.
- 가급적 서버 액션(Server Actions)을 활용하여 클라이언트와 서버 간의 데이터 상호작용을 처리합니다.
## 6. 이미지 및 성능 최적화 (Optimization)
- 모든 이미지는 `next/image` 컴포넌트를 사용하여 자동 최적화(Lazy loading, WebP 변환, 사이즈 최적화 등)를 적용합니다.
- 폰트는 `next/font`를 사용하여 레이아웃 시프트 없이 로드합니다.