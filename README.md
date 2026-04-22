# Raskolnicov Game

Интерактивная игра на `React` + `Vite`, готовая к публикации на GitHub Pages.

## Локальный запуск

Требуется `Node.js 24+`.

1. Установить зависимости:
   `npm install`
2. Запустить проект:
   `npm run dev`
3. Собрать production-версию:
   `npm run build`

## Публикация на GitHub Pages

В проект уже добавлен workflow `.github/workflows/deploy.yml`.

1. Загрузите проект в репозиторий GitHub.
2. В настройках репозитория откройте `Settings -> Pages`.
3. В разделе `Build and deployment` выберите `Source: GitHub Actions`.
4. После пуша в ветку `main` сайт соберётся и опубликуется автоматически.

Итоговый адрес будет в формате:
`https://<github-username>.github.io/<repo-name>/`
