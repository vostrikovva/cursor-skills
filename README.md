# Skills catalog (Cursor)

[English](README.en.md) | [Русский](README.md)

Свой набор Agent Skills: процесс из [Matt Pocock](https://github.com/mattpocock/skills), React/RN/UI из [Vercel](https://github.com/vercel-labs/agent-skills), плюс короткие TypeScript-скиллы под Vite, Next, Express, Nest, Drizzle, Mongo, Tauri, Expo.

Формат тот же, что у Claude (`SKILL.md`), но вызовы завязаны на Cursor: в чате называйте скилл по `name`, не ждите `/grill-me` как в Claude Code.

План: [plans/skills-security-merge.md](plans/skills-security-merge.md). Риски: [SECURITY.md](SECURITY.md). Оригинальная часть: MIT ([LICENSE](LICENSE)). Вендор: [NOTICE.md](NOTICE.md). SHA апстрима: [SOURCES.md](SOURCES.md).

## Установка в проект

Репозиторий: [vostrikovva/cursor-skills](https://github.com/vostrikovva/cursor-skills). Из каталога **целевого приложения**. По умолчанию — **local** и **`.cursor/skills/`** (предпочтительнее `.agents/skills`). `--to` — корень проекта. Флаги: `npx --yes github:vostrikovva/cursor-skills --help`. На Windows не вставляйте лишний `--` перед именем пресета (если вставили — установщик его игнорирует).

Интерактивно (scope, каталог, затем фронт / бэк / БД):

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
npx --yes github:vostrikovva/cursor-skills react --to . --skill-dir agents
npx --yes github:vostrikovva/cursor-skills react --global
```

Cursor читает: `.cursor/skills/`, `.agents/skills/` (проект); `~/.cursor/skills/`, `~/.agents/skills/` (пользователь). Не используйте `--all`. Не ставьте в `~/.cursor/skills-cursor/`. Глобальный пресет виден во всех проектах — не мешайте `react` и `react-ssr`.

High-risk Vercel (deploy/токены/optimize) — только [optional/README.md](optional/README.md).

## Проверка SKILL.md

`npx skills add` при битом YAML **пропускает** файл (`Skipped … YAML parse error`) и ставит остальные скиллы пресета. Частая причина: однострочный `description` с неэкранированным `: ` (compact mapping). Пишите `description` в кавычках, через `>-` или многострочно (как у composition-patterns).

Перед пушем (или после `npm install` — pre-commit через `simple-git-hooks`):

```bash
npm run check-skills
```

Копия в проекте по умолчанию: `.cursor/skills/<name>/` (`npx skills add` также оставляет `.agents/skills/<name>/`). Не `~/.cursor/skills-cursor/`. Если скилл «не поставился», сначала смотрите `Skipped … SKILL.md` в выводе CLI.

## Подпространства

Каждое (кроме чистых `db-*`) включает **core**: grilling, grill-me, grill-with-docs, domain-modeling, to-spec, to-tickets, tdd, implement, code-review, diagnosing-bugs, codebase-design, typescript.

**Каждый** пресет (включая чистые `db-*`) дополнительно ставит `which-skill` (только явный вызов).

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
- **По имени** (`disable-model-invocation`): `grill-me`, `grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `which-skill`. Напишите: «примени скилл grill-me». Для выбора скилла: «примени скилл which-skill» и текст запроса.
- Цикл: grill → spec/tickets → implement + tdd → code-review. После трёх подряд красных полных suite — STOP и вопрос пользователю. Коммит только если вы явно попросили.
- Весь генерируемый код — TypeScript `strict`.

## Каталог скиллов

### Процесс (Pocock, адаптировано)

Описания ниже — из [Reference](https://github.com/mattpocock/skills/tree/main) апстрима, подогнанные под этот каталог: вызов по `name`, без скиллов, которых здесь нет.

| name | Описание |
|------|----------|
| grilling | Беспощадное интервью по плану, решению или идее, пока не закрыта каждая ветка дерева решений. Переиспользуемый примитив интервью за `grill-me` и `grill-with-docs`. |
| grill-me | То же интервью по плану или дизайну, пока не закрыта каждая ветка дерева решений — только по явному вызову. |
| grill-with-docs | Сессия grill, которая ещё и строит доменную модель проекта: уточняет термины и правит `CONTEXT.md` и ADR на месте. |
| domain-modeling | Активно строит и заостряет доменную модель: сверяет термины с глоссарием, стресс-тестирует краевыми сценариями, правит `CONTEXT.md` и ADR на месте. |
| to-spec | Превращает текущий разговор в спецификацию и публикует её в трекер. Без нового интервью: только синтез уже сказанного. |
| to-tickets | Нарезает любой план, спецификацию или разговор на tracer-bullet тикеты; у каждого объявлены рёбра блокировок — текстом в локальном файле или нативными ссылками в настоящем трекере. |
| tdd | Test-driven development с циклом red-green-refactor. Фичи и багфиксы — по одному вертикальному срезу за раз. |
| implement | Делает работу из спецификации или набора тикетов, опираясь на `tdd` на заранее согласованных швах, и закрывает `code-review` перед коммитом. Коммит только если вы явно попросили. |
| code-review | Две оси по diff с фиксированной точки: Standards (стандарты репозитория плюс базовый набор запахов Fowler) и Spec (верно ли реализована исходная issue/spec). Параллельные субагенты, чтобы оси не смешивались. |
| diagnosing-bugs | Дисциплинированный цикл для сложных багов и регрессий производительности: фидбек, который краснеет на этом баге → минимизировать → гипотеза → инструментирование → фикс → регрессионный тест. |
| codebase-design | Общая дисциплина и словарь глубоких модулей: много поведения за узким интерфейсом, на чистом шве, тестируемость через этот интерфейс. |
| which-skill | Рекомендует, какой скилл Cursor или этого каталога применить к запросу. Только по явному вызову; ставится во всех пресетах. |

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
