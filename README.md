Маленький скриптец для скачки замечательной радиопередачи [АЭРОСТАТ](http://www.aquarium.ru/misc/aerostat/) Бориса Гребенщикова.

## Скачать ряд эпизодов в текущую папку

```sh
npx aerostat-dl --min 496 --max 535
```

* `--min Number` start downloading with this number
* `--max Number` last episode to download

## Играть эпизод через Chromecast

```sh
npx aerostat-dl --number 100 --device <myChromeCastDeviceName>
```

### Options

```
Options:
  --version     Show version number                                    [boolean]
  --min         first Aerostat number to download                       [number]
  --max         last Aerostat number to download        [number] [default: 5000]
  --par         number of parallel downloads               [number] [default: 1]
  --number, -n  Aerostat Number to chromecast                           [number]
  --device, -d  Name of chromecast device                               [string]
  --skip, -s    skip Number of seconds
  --help        Show help                                              [boolean]
```
