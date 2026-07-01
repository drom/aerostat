Маленький скриптец для скачки замечательной радиопередачи [АЭРОСТАТ](https://aerostatbg.ru) Бориса Гребенщикова.

## Скачать ряд эпизодов в текущую папку

```sh
npx aerostat-dl --min 496 --max 535
```

* `--min Number` — с какого номера начать скачивание (обязателен для режима скачивания)
* `--max Number` — последний номер (по умолчанию 5000)

Файлы сохраняются в текущую папку как `NNN.mp3`.

### Параллельное скачивание

```sh
npx aerostat-dl --min 496 --max 535 --par 4
```

### Options

```
Options:
  --min <n>   first Aerostat number to download          [number]
  --max <n>   last Aerostat number to download   [number] [default: 5000]
  --par <n>   number of concurrent downloads        [number] [default: 1]
  --help      show help
```

Требуется Node.js >= 22 (используется глобальный `fetch`). Без внешних зависимостей.
