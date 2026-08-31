# Установка только core и замена по имени скилла

Согласовано grill-сессией. Реализация: [`presets.json`](../presets.json), [`scripts/install-subspace.mjs`](../scripts/install-subspace.mjs), README.

## Состав `core`

Явный список в `presets.json`: скиллы из `skills/engineering/` и `skills/productivity/`, **кроме `teach-me`**.

- engineering: `grill-with-docs`, `domain-modeling`, `to-spec`, `to-tickets`, `tdd`, `implement`, `code-review`, `diagnosing-bugs`, `codebase-design`
- productivity: `grilling`, `grill-me`, `which-skill`

`typescript` не в core. Он в стековых пресетах: `react`, `react-ssr`, `backend-express`, `backend-nest`, `mobile` (`tauri-desktop` через `react`).

## Все подпространства тянут `core`

`which-skill` только в `core`. Нет скрытого `everyPresetSkills`.

У каждого пресета кроме `core` — `"extends": ["core"]` (включая `db-postgres` и `db-mongo`). `npx … db-postgres` ставит весь core + Drizzle.

Чистый core: `npx … core --to .` и пункт мастера Core only.

## Пайплайн

1. План: развернуть пресеты, unique, цели `dest/<name>`.
2. Вопросы: реальная установка, TTY, нет `--force`, есть конфликты.
3. Один проход копирования. Без TTY + конфликт + нет `--force` → стоп до шага 3, `exit 1`.

`--force` только отключает вопросы про затирание. Scope / skill-dir / project directory по-прежнему спрашиваются, если не заданы.

`--dry-run` не менять: печать списка и dest, без копирования.

## Интерактив

Первый экран:

- **Core only** — productivity + engineering (`skills/productivity`, `skills/engineering`)
- **Customize stack** — Frontend / Backend / Database

Customize и три Skip: скиллы не ставить, не `exit 1`, сообщение что ничего не установлено.

## Конфликты

Каталог установки (`.cursor/skills` и аналоги) никогда не удаляется целиком. Скиллы вне текущего плана не трогаем.

- **новые** — в dest нет каталога с таким `name` → копируем после вопросов по конфликтам
- **конфликты** — в dest уже есть каталог с точным тем же `name`

TTY без `--force`, на каждый конфликт:

- **Replace** — перезаписать только этот скилл (`rm`+`cp` `dest/<name>`)
- **Skip** — не перезаписывать этот скилл; оставить уже стоящую копию. Не отмена всей установки
- **Replace remaining / Skip remaining** — то же для остальных ещё не отвеченных конфликтов этого запуска

Skip по одному имени не мешает поставить новые скиллы из плана.

`--force`: все конфликты = Replace.

Без TTY и без `--force` при любом конфликте: abort до copy (включая новые имена). Сообщение: какие имена уже стоят; почему нет молчаливой перезаписи; включить интерактив (установщик без имён пресетов в TTY) или `--force`.

Именованный пресет в обычном терминале: тоже спрашивать по каждому конфликту.

## Документация

README ru/en и `usage()`: core-only; каждый пресет включает core; повторная установка спрашивает по каждому уже стоящему скиллу из плана; dest целиком не сносится; без TTY — abort, интерактив или `--force`.
