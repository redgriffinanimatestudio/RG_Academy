# RG CGAcademy — Централизованная система управления (AI‑контролируемая)

**Версия:** v0.1 (draft)  
**Фокус:** Dashboard педагогов, управление студентами, самообучаемый контролируемый ИИ.  
**Интеграция:** Веб‑приложение и мобильные приложения.  

---

## 0) Цели и принципы
**Цели**
- Централизованное управление академией: департаменты, программы, курсы, расписания, задания, оценивание, портфолио.
- Рост качества обучения за счёт **контролируемого ИИ**: персональные траектории, раннее выявление рисков, умные подсказки.
- Интеграция со студией (реальные проекты, стажировки, B2B‑кейсы) и маркетингом (приём, CRM, вакансии).

**Принципы**
- **Human‑in‑the‑Loop (HITL)**: ИИ только предлагает; финальные решения — у педагогов/админов.
- **Explainable AI**: прозрачные объяснения «почему рекомендовано».
- **Privacy‑by‑Design**: минимизация PII, согласия, шифрование, аудит.
- **Event‑Driven** и **наблюдаемость**: трейсинг, метрики, логи, перезапуски без потерь.
- **Модульный монолит** с «событийным позвоночником» (Outbox+EventBus) → готовность к микро‑сервисам.

---

## 1) Роли и Use‑Cases
**Роли**: Студент, Педагог, Ментор/Ревьюер, Руководитель департамента (HoD), Куратор программы, Администратор, Партнёр (студия/работодатель).

**Карта Use‑Cases (сжатая)**
- **Студент**: записаться → план‑лестница (Foundation→Core→Advanced→Capstone) → задания → ревью → оценки/скилл‑граф → портфолио → стажировка/вакансии.
- **Педагог**: конструктор курса/модулей → расписание → рубрики оценивания → проверка работ → ИИ‑подсказки (approve/decline) → отчёты.
- **Ментор**: ревью проектов (Capstone, B2B) → комментарии → апрув ИИ‑оценок/флагов.
- **HoD/Куратор**: матрица программ/дисциплин, нагрузка, KPI департамента, риск‑панель.
- **Админ**: роли/политики (RBAC/ABAC), интеграции, биллинг, справочники.
- **Партнёр**: вакансии, брифы задач, отбор портфолио.

---

## 2) Доменная модель (основа)
**Академия**: Department → Program (Comprehensive/Standard/Express; уровни A/B/C/D) → Course → Module → Lesson → Assignment → Submission → Grade (Rubric) → Certificate/Micro‑credential.

**Люди/Организации**: Student, Teacher, Mentor, HoD, Admin, Partner(Company), Recruiter.

**Учебный процесс**: Cohort, Schedule, Attendance, SkillGraph (компетенции/навыки), PortfolioItem.

**Коммуникации**: Discussion, Chat, Announcement, Notification.

**Оценивание**: Rubric, Criteria, PlagiarismCheck (опционально, с HITL), Peer‑Review.

**B2B/Студия**: ProjectBrief, AssignmentLink, NDA/Consent, Internship.

---

## 3) Сквозные потоки (E2E)
1. **Набор/зачисление**: заявка → тест/портфолио → оффер → оплата/договор → зачисление в cohort.
2. **Обучение**: контент/уроки → задания → ИИ‑подсказки по проблемным темам → ревью → оценка по рубрике.
3. **Траектория**: ИИ строит дорожную карту (по скилл‑графу), учит на прогрессе; педагог подтверждает изменения.
4. **Capstone & B2B**: бриф от студии → проект → итерации → защита → портфолио → вакансии.
5. **Аналитика**: дашборды успеваемости, риск‑панель, эффективность курсов, загрузка педагогов.

---

## 4) Архитектура (слои и сервисы)
```
[ Web (Next.js/React) | Mobile (RN/Flutter) ]
              ↓
        [ API Gateway / BFF ]  ← Edge cache
              ↓
  ┌──────────────────────────────────────────┐
  │        Модульный монолит (FastAPI)      │
  │  • Identity & Access (RBAC/ABAC, SSO)   │
  │  • Academy Catalog (dept/program/course)│
  │  • Learning Process & Schedule          │
  │  • Assignments & Submissions            │
  │  • Assessment & Rubrics                 │
  │  • Portfolio & Placement (B2B)          │
  │  • Content/Media (VOD/live, CDN)        │
  │  • Communications (chat, notif)         │
  │  • Billing (оплата, инвойсы)            │
  │  • Analytics & LRS (xAPI)               │
  │  • Admin/Settings                       │
  └──────────────────────────────────────────┘
              ↓                ↘
       [Outbox → EventBus]      ↘
              ↓                   [AI Engine]
      [DBs / Storage]                 │
 (PostgreSQL, S3, Search, LRS)   [Feature Store]
                                   [Model Registry]
                                   [Evaluation/Drift]
```

**Технологические ориентиры** (варианты):
- Backend: Python FastAPI + SQLAlchemy + Postgres; Outbox+EventBus; Celery/Dramatiq для фоновых задач.
- Search: OpenSearch/Elastic; Media: S3/MinIO; LRS: xAPI совместимый стор.
- Analytics: ClickHouse/BigQuery; дашборды: Superset/Metabase.
- MLOps: MLflow/Weights&Biases, Feast (feature store), Airflow/Prefect, DVC.
- Frontend: Next.js/React + Tailwind (shadcn/ui); Mobile: React Native/Flutter (BFF слой для оптимизации трафика).

---

## 5) AI Engine — «самообучаемый контролируемый»
**Модули**
- **RAG‑наставник**: чат‑тьютор по материалам курса (curated KB, цитируемые источники).
- **Рекомендации траектории**: выбор курсов/модулей/упражнений по скилл‑дефицитам.
- **Knowledge Tracing / Mastery**: оценка вероятности владения темами.
- **Риск‑модели**: раннее обнаружение отставаний/выгорания.
- **Оценивание с рубриками**: ассист ИИ (пред‑скоринг, педагоги утверждают/исправляют).
- **Качество работ**: эвристики+модели, детектор повторов/плагиата (только с HITL).
- **Портфолио‑помощник**: селекция лучших работ, формулировки описаний.

**Контроль и безопасность**
- Очередь «AI Suggestions» для педагогов: approve/decline/feedback → дообучение.
- Model Registry, offline/online‑оценки, A/B, канареечные релизы.
- Drift/quality мониторинг, этика/стоп‑списки, фильтры контента.
- Объяснимость: «почему рекомендовано» + видимые признаки/фичи.
- Управление данными: анонимизация, PII‑редакшн, согласия, ретеншн‑политики.

---

## 6) Данные и интеграции
**Хранилища**: Postgres (OLTP), S3/MinIO (медиа, портфолио), Search, LRS (xAPI), ClickHouse (события/аналитика).

**Схема (ключевые таблицы, кратко)**
- academy_departments, programs, courses, modules, lessons.
- cohorts, enrollments, schedules, attendance.
- assignments, submissions, reviews, grades, rubrics, criteria.
- users, roles, policies (ABAC), consents, audit_logs.
- portfolio_items, skill_graph, skill_evidence.
- b2b_projects, partners, vacancies, applications.

**Интеграции**: SSO (OAuth/OIDC), платежи, почта/SMS/push, видео (VOD/live), календарь.

---

## 7) UI/UX — ключевые экраны
**Педагог (Dashboard)**
- «Курсы и группы»: списки, статусы, расписания.
- «Проверка и рубрики»: очередь работ, быстрые разметки, AI‑подсказки.
- «Риски и прогресс»: тепловые карты, флаг‑панель.
- «Аналитика»: эффективность заданий, загрузка времени, NPS студентов.

**Студент (App/Web)**
- «Сегодня»: дедлайны, занятия, рекомендации.
- «Моя траектория»: лестница уровней, достижения, бейджи.
- «Задания»: статусы, ревью, чат с наставником (RAG‑тьютор).
- «Портфолио»: выбор лучших работ, публикация, отклик на вакансии.

**Админ/HoD**
- Матрица программ/курсов, нормирование нагрузки.
- Политики доступа, интеграции, отчётность.

---

## 8) API (черновые контракты)
**REST (пример)**
- GET /api/departments, /programs, /courses/{id}
- GET/POST /cohorts, /enrollments
- GET/POST /assignments, /submissions, /grades
- GET /analytics/progress?cohort=…
- POST /ai/suggest/trajectory { student_id }
- POST /ai/grade/assist { submission_id } → { draft_score, rationale }
- POST /ai/suggestion/{id}/decision { approve|decline, comment }

**Events (пример)**
- Student.Enrolled, Assignment.Submitted, Grade.Published, AI.Suggestion.Created, AI.Suggestion.Decided.

---

## 9) MVP → Roadmap (6 спринтов)
- **S0 Discovery & Data**: компетенции/скилл‑граф, источники данных, базовые схемы.
- **S1 Core LMS**: департаменты/программы/курсы, зачисления, расписание, задания, базовые рубрики.
- **S2 Dashboards**: педагог/студент, очереди проверок, уведомления.
- **S3 AI v1**: RAG‑тьютор, простые рекомендации, очередь «AI Suggestions» (HITL).
- **S4 Analytics & Risks**: риск‑панель, отчёты HoD, ClickHouse/LRS.
- **S5 Capstone & B2B**: портфолио, брифы, вакансии, интеграция партнёров.

**DoD примеры**: latency P95<300ms, доступность ≥99.9%, логирование 100% событий оценивания, GDPR‑согласия.

---

## 10) KPI и мониторинг
- Успеваемость (mastery %), время до фидбэка, доля принятых AI‑подсказок, ретеншн студентов, трудоустройство (3/6/12 мес), NPS.

---

## 11) Безопасность/соответствие
- RBAC+ABAC (роль+атрибуты: департамент, курс, cohort).
- PII: шифрование «на диске» и «в полёте», key‑rotation, минимизация.
- Consent & Audit: согласия на ИИ‑обработку; неизменяемый журнал действий.
- Контент‑модерация, защита от злоупотреблений, анти‑cheating меры (HITL).

---

## 12) Маппинг на «Ознакомление с академией»
- Департаменты/Программы/Уровни A–D → Program/Course/Cohort/SkillGraph.
- Полные направления (10), спецкурсы (15), поддерживающие (7) → Catalog.
- Интеграция «школа+студия» → Capstone/B2B.
- Инвест‑тезисы, маркетинг → отдельные модули CRM/лендинг/аналитика.

---

## 13) Риски и гардрейлы
- Переобучение/дрейф моделей → регулярные оффлайн‑оценки, дрейф‑алерты.
- Прайвеси/комплаенс → DPIA, DPO‑контуры, data minimization by default.
- Надёжность → blue/green, бэкапы, disaster‑дни, SLO/SLA.

---

## 14) Следующие шаги (для подтверждения)
1) Утвердить доменные сущности и минимальный каталог курсов/уровней.  
2) Зафиксировать KPI и метрики риска.  
3) Выбрать стеки фронт/мобайл (RN или Flutter) и MLOps (MLflow/Feast варианты).  
4) Подготовить черновые схемы БД (DDL v0) и контракты API (OpenAPI v0).  
5) S0 → запуск «Discovery & Data».  



---

## 15) Глобальные интеграции (roadmap)
**Категории и стандарты**
- **Identity & SSO**: OAuth2/OIDC (Google, Apple, Microsoft), SAML/Shibboleth (edu), eduGAIN; MFA/TOTP, passkeys.  
- **LMS/e‑Learning**: LTI 1.3/Advantage (Deep Linking, Names & Roles, Grade Service), xAPI (TinCan) + LRS, SCORM (legacy), IMS Caliper.  
- **SIS/HR/CRM**: Workday Student, PeopleSoft Campus, Ellucian Banner, SAP SuccessFactors (HR), Salesforce/HubSpot (CRM) — через iPaaS/коннекторы и webhooks.  
- **Видео и коммуникации**: Zoom/Teams/Google Meet, YouTube/Vimeo Live; чаты Slack/Discord, e‑mail/SMS/push провайдеры.  
- **Хранилища**: Google Drive, OneDrive, Dropbox, S3/MinIO.  
- **Платежи/биллинг**: Stripe/Adyen/PayPal + локальные PSP; инвойсинг и валюты.  
- **Портфолио/про‑соцсети**: LinkedIn, Behance, ArtStation, Dribbble, GitHub, Kaggle, Sketchfab/Marmoset (3D).  
- **Креденшелы**: Open Badges 2.0, W3C Verifiable Credentials (VC), QR‑проверка, опционально — привязка к EBSI/реестрам.  
- **Аналитика & наблюдаемость**: GA4/Matomo, Segment, Amplitude; Sentry/Prometheus/Grafana.

**Интеграционная шина**
- Connector SDK (pull/push, polling/webhooks), Retry/DLQ, Secret Store, Mapping/Transform (ETL/ELT), версионирование схем, тестовые песочницы.

**Data Portability & Trust**
- Экспорт/импорт (JSON/CSV/xAPI statements), правовые основания (GDPR/CCPA), Audit Trail, Data Contracts.

---

## 16) Профиль уровня топовых соцсетей (Student/Teacher/Partner)
**Идентичность и оформление**
- Handle + vanity URL, display name, локали/языки, временная зона; фото/обложка, краткий «tagline», ссылки.  
- Многоязычные поля (bio, должность, город), контактные ссылки с уровнями видимости.

**Компетенции и опыт**
- Skill Graph с уровнями владения; endorsments/рекомендации от педагогов/менторов/партнёров.  
- Образование, опыт, сертификаты/бейджи (Open Badges/VC), публикации/награды.

**Портфолио и шоукейс**
- Проекты/кейсы: обложки, роли, стек, процессы; медиа (из S3/Sketchfab/YouTube/Vimeo).  
- «Highlights», подборки по темам, quick‑reels (короткие демо клипы).

**Активность и связь**
- Лента (posts), реакции, комментарии, репосты, упоминания, хэштеги, события/ивенты, группы/клубы.  
- Социальные связи (follow/friend/mentor/peer), приватные сообщения, запросы в портфолио‑ревью.

**Верификации и безопасность**
- Уровни «Verified»: e‑mail/телефон, edu‑верификация (документы), KYC для партнёров.  
- Privacy per‑field (public/followers/cohort/only‑me), блокировки, отчёты о нарушениях.  
- Доступность: alt‑тексты, субтитры/кэпшены, high‑contrast режим.

**Аналитика профиля**
- Просмотры/кто смотрел (агрегировано), клики по портфолио, приглашения/офферы, CTR по вакансиям, рост скиллов.

---

## 17) Социальный граф и контент‑модель
**Граф**: Nodes (User, Group, Event, Project, Course), Edges (follow, member_of, mentor_of, collaborated_on) с весами/атрибутами.  
**Контент**: Post, Comment, Reaction, Attachment (image/video/3D), Mention, Tag.  
**Модерация**: очереди модерации, флаги (spam/toxicity/copyright), арбитраж HITL.

---

## 18) AI для профиля/сети
- **Talent Match**: сопоставление студентов с брифами/вакансиями.  
- **Skill Gap Coach**: рекомендации по закрытию дефицитов (курсы/упражнения).  
- **AI Portfolio Curator**: авто‑сборки кейсов, описания, ключевые фразы, i18n.  
- **Smart Feed**: ранжирование ленты по целям (найти стажировку/прокачать навык).  
- **Safety AI**: подсказки по этике публикаций, предупреждения о рисках приватности.  
- HITL‑контуры: педагоги/модераторы подтверждают тонкие решения.

---

## 19) API & Dev Portal
- **GraphQL** для профилей/соцграфа/ленты; REST для LMS/оценивания; Streaming (SSE/WebSocket) для событий.  
- **Webhooks**: profile.updated, post.created, credential.issued, job.match.  
- **OAuth scopes**: `profile.read`, `profile.write`, `portfolio.manage`, `social.post`, `ai.suggest.read`, `admin.*`.  
- **Рейт‑лимиты** и ключи; тестовые песочницы, вендор‑guides, OpenAPI/SDL схемы, примеры SDK (TS/Python).

---

## 20) Governance, комплаенс и этика
- **Правовые базы**: GDPR/CCPA/ePrivacy; возрастные пороги; DPIA, DPO‑процессы.  
- **Управление моделями**: registry, offline‑eval, drift, fairness, контент‑фильтры.  
- **Data Lifecycle**: ретеншн, запрос на удаление, портирование данных, версии профиля.

---

## 21) Дорожная карта интеграций (G‑фазы)
- **G1 (Core)**: SSO/OIDC, облачные диски, Zoom/Teams/Meet, e‑mail/SMS/push, базовый GraphQL.
- **G2 (Edu‑standards)**: LTI 1.3, xAPI+LRS, SCORM import, Caliper events.
- **G3 (Credentials)**: Open Badges 2.0, Verifiable Credentials, QR‑валидация.
- **G4 (Talent/HR/CRM)**: LinkedIn/ArtStation/Behance, Salesforce/HubSpot, вакансии API. 
- **G5 (Marketplace/Ext)**: коннекторный маркетплейс, партнёрские приложения и виджеты.

---

## 22) KPI для соц‑модуля
- Заполнение профиля ≥80%, доля публичных портфолио, средний отклик партнёров, время до первого оффера, доля принятых AI‑рекомендаций, ретеншн сообществ.

---

## 23) Следующие шаги (соц‑модуль)
1) DDL v0: `profiles`, `profile_privacy`, `external_accounts`, `portfolio_items`, `social_posts`, `social_comments`, `social_reactions`, `follows`, `groups`, `events`, `verifications`, `credentials`.  
2) OpenAPI/GraphQL v0: контракты профиля/ленты/связей + webhooks.  
3) UX‑макеты: Профиль, Редактор портфолио, Лента, Группы, Ивенты.  
4) Коннекторы G1: SSO, Drives, Video, Notifications (SDK + sandbox).  



---

## 24) Сшивка с чатом «Ознакомление с академией» (Parts I–V)
**Part I — DAC COURSE STRUCTURE (зафиксировано):**  
• Департамент: **Interior Design**.  
• Программы: **Comprehensive Course for Interior Designers** (уровни A/B/C/D), **Standard Course** №1–3, **Express Course**.  
• Категории терминов: **Profession / Comprehensive / Standard / Express** (используем как справочники ProgramType/Label).  

**Part III — MARKETING:**  
• Цели: стратегия RG с фокусом на образование, продакшн, B2B‑партнёрства, инвесторы, найм.  
• УТП: интегрированная система «школа + студия», AI‑менторство, стажировки.  
• Каналы: студенты (SMM/контекст/SEO/инфлюенсеры/геймификация), студия (фестивали/портфолио/нетворкинг/B2B), партнёрства (студии/гейм‑компании/платформы), инвесторы (форумы/фонды), найм (LinkedIn/ArtStation/80 Level).  

**Part IV — Slide (RG Academy & RG Studio):**  
• Питчи для двух направлений: Academy и Studio (цель — $50M+ на каждое).  
• Бизнес‑модель Academy: B2C подписки/платежи, B2B корп‑обучение/аутстафф/партнёрства, сертификация (Open Badges/VC).  
• KPI: >50 инвест‑встреч, $50M+ фандрайз; дорожная карта: 1–6 мес (структура→визуалы→кампании→переговоры).  

**Part V — Список курсов (ядро каталога):**  
• **Полные направления (10):** CG Generalist; 3D‑моделирование; Текстурирование и материалы; Риггинг/Tech Animation; Анимация персонажей; VFX & Симуляции; Lighting & Rendering; Композитинг & пост‑продакшн; Game Art & Environment; CG‑Продюсирование/управление.  
• **Спецкурсы (15):** Hard Surface; Organic Sculpt; Advanced UV/Texturing; Facial Rigging; Creature Animation; Cinematic Lighting; Advanced FX (Houdini); Photoreal Rendering; MoCap & Retargeting; Virtual Production & Unreal; Matte Painting & Compositing; Stylized 3D; LookDev & Shaders; Camera Tracking/Matchmoving; Project Management.  
• **Поддерживающие дисциплины (7):** История искусств/анимации; Академический рисунок; Дизайн/композиция; Теория цвета; Фото/операторское; CG Pipeline & Production Mgmt; Soft Skills & карьера.  
• Принципы: Полные — путь от базы до продакшна; Спец — 1–3 мес глубокого погружения; интеграция со студией.

---

## 25) Каталог программ — Seeds v0 (структура/пример)
**Справочники**: ProgramType = {comprehensive, standard, express, specialization, support}; Level = {A,B,C,D}; Department = {interior_design, cg, vfx, game_art, motion, etc}.  

**Пример YAML‑заготовки (для seeds/fixtures):**
```yaml
departments:
  - key: interior_design
    title: "Interior Design"
    programs:
      - key: interior_comprehensive
        type: comprehensive
        levels: [A, B, C, D]
      - key: interior_standard_1
        type: standard
      - key: interior_standard_2
        type: standard
      - key: interior_standard_3
        type: standard
      - key: interior_express
        type: express

  - key: cg_generalist
    title: "CG Generalist"
    programs:
      - key: cg_full_path
        type: comprehensive
        levels: [A, B, C, D]
      - key: cg_special_hard_surface
        type: specialization
      - key: cg_special_organic_sculpt
        type: specialization
      - key: cg_support_history
        type: support
```
> Примечание: для каждого Program → Courses/Modules/Lessons будут описаны отдельно; mapping в SkillGraph обязателен.

---

## 26) Interior Design — карта программы (пример маппинга)
**Program: interior_comprehensive**  
• A (Foundation): основы эргономики, чертёж/рисунок, базовые материалы/рендер; софт: AutoCAD/SketchUp/Blender.  
• B (Core): планировки, мебель/свет, колористика, визуализация (Lighting & Rendering), базовый BIM.  
• C (Advanced): комплексные проекты (квартиры/общественные), авторский стиль, VR‑презентации (UE5).  
• D (Capstone+Practice): реальный бриф от студии/партнёра, бюджет/сроки, защита.  
**Standards #1–3:** отдельные треки по планировкам, визуализации, материаловедению.  
**Express:** интенсив по визуализации/презентациям (портфолио‑спринт).  
**SkillGraph связка:** ergonomics, drafting, color, lighting, materials, BIM, UE, presentation, client brief.

---

## 27) Процесс набора и проведения (MicroCampus Baku)
**Формат:** live‑work студия **6–8 мест**, **вечерние занятия** + дневной **Open Studio**.  
**Cohort:** 6–12 студентов; ratio Teacher:Student ≈ 1:8.  
**Пайплайн:** заявка → отбор (диагностика/портфолио) → оффер → оплата/договор → онбординг → занятия/ревью → Capstone → стажировка.  
**Расписание (пример):** Пн/Ср/Пт 19:00–22:00 (лекции/практика), Сб 11:00–17:00 (студийная работа/менторинг), Open Studio: будни 10:00–18:00.  
**Интеграция со студией:** мини‑брифы в течение модулей + финальный Capstone с партнёром.

---

## 28) Маркетинг/CRM (маппинг из Part III)
**Воронка:** Lead → Application → Assessed → Offer → Enrolled → Active → Alumni.  
**Сегментация:** по департаментам/уровням/целям (портфолио, трудоустройство, апскилл).  
**Автоматизации:** e‑mail/SMS/push, лендинги по программам, UTM/атрибуция, CPL/CAC/LTV в аналитике.  
**B2B контуры:** партнёрские брифы, вакансии, акселераторы, корпоративные группы.  
**Найм:** интеграции LinkedIn/ArtStation/Behance; трекинг офферов.

---

## 29) Финансовая модель (контуры из Part IV)
**Потоки:** B2C (помесячно/семестры), B2B (корп‑обучение/аутстафф/проекты), гранты/спонсоры, мерч/ивенты.  
**Учёт:** договоры/инвойсы/платежи; стипендии/рассрочки; прайс‑планы для Standard/Express.  
**KPI:** Retention, ARPU, CPA/CAC, GM, трудоустройство (3/6/12 мес), доля принятых AI‑подсказок.

---

## 30) Модели оценивания и рубрики
**RubricMatrix:** критерии (качество идеи/техники/композиции/референсы/тайм‑менеджмент), веса по уровням A–D.  
**HITL:** ассист‑скоринг ИИ → апрув/редакция педагога → публикация; хранение версий и объяснений.

---

## 31) Точки интеграции каталога ↔ AI Engine
• **Knowledge Tracing:** уровни A–D → mastery‑кривые по узлам SkillGraph.  
• **Trajectory Recommender:** выбор Standard/Express модулей для закрытия пробелов.  
• **Portfolio Curator:** выделение «highlights» под цели (вуз/вакансия/грант).  
• **Talent Match:** соответствие студента брифам/вакансиям партнёров (весовые признаки: навыки/оценки/темп).  

---

## 32) Расширения API (каталог и приём)
**REST:**  
GET /api/catalog/departments; GET /api/catalog/programs?dept=…; GET /api/catalog/programs/{key};  
GET /api/catalog/programs/{key}/levels; GET /api/catalog/courses?program=…;  
POST /api/admissions/applications; POST /api/admissions/assessments; POST /api/admissions/offers;  
GET /api/placements/vacancies; POST /api/placements/applications.  
**GraphQL:** узлы Department, Program(type, levels), Course, Skill, Vacancy, PortfolioItem; связи: program→courses, user→skillGraph.

---

## 33) Следующие шаги (после интеграции)
1) Сформировать **seed‑пакет v0** (YAML/JSON) для департаментов и программ (Part V + Interior Design).  
2) Подготовить **DDL v0** для каталогов/приёма/оценивания (таблицы `departments`, `programs`, `program_levels`, `courses`, `skills`, `applications`, `offers`, `enrollments`, `rubrics`, `criteria`).  
3) Выпустить **OpenAPI/GraphQL v0** (каталог + приём + AI‑hooks).  
4) Сверстать **UX‑макеты**: «Каталог», «Поступление», «Teacher Review Queue», «Student Trajectory».  
5) Уточнить KPI/фин‑метрики по целевому пилоту **MicroCampus Baku**.

