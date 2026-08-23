# Skills catalog (Cursor)

[English](README.en.md) | [Русский](README.md)

Свой набор Agent Skills: процесс из [Matt Pocock](https://github.com/mattpocock/skills), React/RN/UI из [Vercel](https://github.com/vercel-labs/agent-skills), плюс короткие TypeScript-скиллы под Vite, Next, Express, Nest, Drizzle, Mongo, Tauri, Expo.

Формат тот же, что у Claude (`SKILL.md`), но вызовы завязаны на Cursor: в чате называйте скилл по `name`, не ждите `/grill-me` как в Claude Code.

План: [plans/skills-security-merge.md](plans/skills-security-merge.md). Риски: [SECURITY.md](SECURITY.md). Оригинальная часть: MIT ([LICENSE](LICENSE)). Вендор: [NOTICE.md](NOTICE.md). SHA апстрима: [SOURCES.md](SOURCES.md).

## Установка в проект

Репозиторий: [vostrikovva/cursor-skills](https://github.com/vostrikovva/cursor-skills). Из каталога **целевого приложения**. `--to` по умолчанию — текущая папка. На Windows не вставляйте лишний `--` перед именем пресета (если вставили — установщик его игнорирует).

Интерактивно (стрелки: фронт / бэк / БД):

```bash
npx --yes github:vostrikovva/cursor-skills
```

Без меню, сразу пресет:

```bash
npx --yes github:vostrikovva/cursor-skills react --to .
npx --yes github:vostrikovva/cursor-skills react-ssr --to .
npx --yes github:vostrikovva/cursor-skills tauri-desktop --to .
npx --yes github:vostrikovva/cursor-skills backend-express db-postgres --to .
npx --yes github:vostrikovva/cursor-skills backend-nest db-mongo --to .
npx --yes github:vostrikovva/cursor-skills mobile --to .
```

Локально, из клона этого каталога:

```bash
npx --yes . react --to ../my-app
npx --yes github:vostrikovva/cursor-skills --list
npx --yes github:vostrikovva/cursor-skills react --dry-run
```

Не используйте `--all`. Не ставьте скиллы в `~/.cursor/skills-cursor/` и не ставьте каталог глобально (`-g`): пресеты взаимоисключающие.

High-risk Vercel (deploy/токены/optimize) — только [optional/README.md](optional/README.md).

## Подпространства

Каждое (кроме чистых `db-*`) включает **core**: grilling, grill-me, grill-with-docs, domain-modeling, to-spec, to-tickets, tdd, implement, code-review, diagnosing-bugs, codebase-design, typescript.

| Имя | Стек | Не ставит |
|-----|------|-----------|
| `react` | Vite + React + TS, composition, web UI guidelines | Next, `vercel-react-best-practices` |
| `react-ssr` | Next.js и его бандлер (Turbopack/webpack), RBP Vercel | Vite (`vite-react`) |
| `tauri-desktop` | как `react` + Tauri IPC/capabilities | RN, Nest |
| `backend-express` | Express + TS | Nest |
| `backend-nest` | Nest + TS | Express |
| `db-postgres` | Drizzle + Postgres | Mongo |
| `db-mongo` | Mongo + TS | Postgres |
| `mobile` | Vercel RN + Expo | Vite desktop |

Не ставьте `react` и `react-ssr` в один репозиторий.

Подпространства убирают **не установленные** скиллы. Cursor всё равно кладёт description **установленных** в контекст.

## Как пользоваться

- **Сами по задаче** (model-invoked): `tdd`, `typescript`, `vite-react`, `nextjs`, composition, UI guidelines, Express/Nest и т.д. — агент может взять их, если description совпал.
- **По имени** (`disable-model-invocation`): `grill-me`, `grill-with-docs`, `to-spec`, `to-tickets`, `implement`. Напишите: «примени скилл grill-me».
- Цикл: grill → spec/tickets → implement + tdd → code-review. После трёх подряд красных полных suite — STOP и вопрос пользователю. Коммит только если вы явно попросили.
- Весь генерируемый код — TypeScript `strict`.

## Каталог скиллов

### Процесс (Pocock, адаптировано)

| name | Когда |
|------|--------|
| grilling | Интервью по дереву решений |
| grill-me | То же, только по явному вызову |
| grill-with-docs | Grill + CONTEXT.md / ADR |
| domain-modeling | Глоссарий и термины |
| to-spec | Собрать спецификацию из чата |
| to-tickets | Нарезать тикеты |
| tdd | Red-green по швам |
| implement | Сделать работу из spec/tickets |
| code-review | Standards + spec по diff |
| diagnosing-bugs | Дисциплина отладки |
| codebase-design | Глубокие модули / швы |

### Frontend / mobile (Vercel + свои)

| name | Когда |
|------|--------|
| vite-react | SPA на Vite, не Next |
| nextjs | Next App Router и бандлер Next |
| vercel-react-best-practices | Perf React/Next (пресет react-ssr) |
| vercel-composition-patterns | Составные компоненты |
| web-design-guidelines | A11y / UX audit |
| vercel-react-native-skills | RN performance |
| expo-rn | Expo Router, EAS |
| tauri | Desktop IPC, capabilities |

### Backend (свои)

| name | Когда |
|------|--------|
| typescript | Strict, границы API |
| express-api | HTTP на Express |
| nestjs | Модули Nest |
| postgres-drizzle | Схема и миграции |
| mongodb | Документы и индексы |
