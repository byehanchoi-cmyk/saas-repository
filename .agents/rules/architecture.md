---
trigger: always_on
---

# Clean Architecture Implementation Guide
## Shopping Review Analysis Chatbot Project
이 문서는 본 프로젝트에 클린 아키텍처를 적용하기 위한 상세 가이드라인입니다. 비즈니스 로직을 기술적 세부 사항(Next.js, Supabase, Pinecone 등)으로부터 분리하여 유지보수성과 테스트 가능성을 높이는 것을 목표로 합니다.
---
## 1. 폴더 구조 (src/ 디렉토리)
현재 구성된 `src/` 디렉토리의 역할과 각 폴더에 들어갈 구체적인 예시입니다.
### 📂 `domain/` (The Core - 핵심 비즈니스 로직)
외부 라이브러리나 프레임워크에 의존하지 않는 순수한 자바스크립트/타입스크립트 코드입니다.
-   **entities/**: 핵심 데이터 모델 (예: `Review.ts`, `ChatHistory.ts`, `AnalysisResult.ts`)
-   **repositories/**: 데이터 접근을 위한 인터페이스 정의 (예: `IReviewRepository.ts`, `IVectorStore.ts`)
-   **usecases/**: 사용자의 액션 단위 로직 (예: `AnalyzeReviewComplexity.ts`, `GetStreamingChatResponse.ts`)
### 📂 `application/` (The Orchestrator - 흐름 제어)
도메인 모델을 조작하여 실제 서비스 기능을 수행합니다.
-   **dtos/**: 데이터 전달 객체 (예: `AnalyzeReviewRequest.dto.ts`)
-   **services/**: 여러 유스케이스를 조합하거나 시스템 전반의 핵심 기능 (예: `ChatCoordinationService.ts`)
-   **mappers/**: 외부 데이터(DB, API)를 도메인 엔티티로 변환하는 로직
### 📂 `infrastructure/` (Technical Details - 외부 연동)
프레임워크, DB, 외부 서비스와의 실제 통신을 담당합니다.
-   **repositories/**: 도메인 계층에 정의된 인터페이스의 실제 구현체 (예: `SupabaseReviewRepository.ts`)
-   **datasources/**: 외부 API 클라이언트 설정 (예: `pineconeClient.ts`, `geminiApi.ts`)
-   **config/**: 환경 변수 및 인프라 설정 (예: `env.config.ts`)
### 📂 `presentation/` (The View - UI 및 사용자 경험)
사용자에게 보여지는 부분과 UI 전용 로직입니다.
-   **components/**: Atomic Design 기반 UI 컴포넌트 (`atoms`, `molecules`, `organisms`)
-   **hooks/**: React 전용 커스텀 훅 (예: `useChat.ts`, `useReviewStats.ts`)
-   **store/**: 클라이언트 상태 관리 (Zustand 등)
---
## 2. 의존성 규칙 (Dependency Rule)
**"모든 의존성은 내부(Domain)를 향해야 한다"**는 원칙을 반드시 지켜야 합니다.
-   `Infrastructure`는 `Domain`을 알고 있어야 합니다 (인터페이스 구현을 위해).
-   `Presentation`은 `Application` 및 `Domain`을 알 수 있습니다.
-   **`Domain`은 외부의 어떤 것도 몰라야 합니다.** (Next.js, Supabase, API API 등에 의존하지 않음)
---
## 3. 이 프로젝트에서의 핵심 흐름 (예: 리뷰 분석)
1.  **UI (`presentation`)**: 사용자가 분석 버튼을 클릭합니다.
2.  **Next.js API/Server Action (`app/api`)**: 요청을 받아 `Application` 서비스나 `UseCase`를 호출합니다.
3.  **UseCase (`domain/usecases`)**: `Infrastructure`의 `Repository`를 통해 데이터를 가져오고, 비즈니스 규칙에 따라 분석을 수행합니다.
4.  **Repository (`infrastructure`)**: 실제 `Supabase`나 `Pinecone`에서 데이터를 조회하여 `Mapper`를 통해 `Domain Entity`로 변환해 반환합니다.
---
## 4. 프레임워크(`app/`)와의 관계
Next.js의 `app/` 폴더는 이 아키텍처에서 **진입점(Entry Point)** 역할을 합니다.
-   **Pages/Layouts**: `src/presentation`의 컴포넌트들을 조립하여 화면을 구성합니다.
-   **Server Actions**: `src/application`이나 `src/domain/usecases`를 호출하는 브릿지 역할을 수행합니다.
이 구조를 유지함으로써, 나중에 DB를 Supabase에서 다른 것으로 바꾸거나, UI 프레임워크를 변경하더라도 핵심 비즈니스 로직(`domain`)은 수정 없이 보존할 수 있습니다.
