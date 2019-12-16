# aerostat

Little tool chain to deal with amazing [aerostat](http://aerostatica.ru/) radio podcast.

## Usage

### Download range of episodes into current folder.

```sh
npx aero-stat --min 496 --max 535
```

* `--min Number` start downloading with this number
* `--max Number` last episode to download

### Play on Aerostat on chromecast device.

```sh
npx aero-stat --number 100 --device <myChromeCastDeviceName>
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
