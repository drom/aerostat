# aerostat

Little tool chain to deal with amazing [aerostat](http://www.aquarium.ru/misc/aerostat/) radio podcast http://aerostatica.ru/.

## Install

```sh
cd <work>
git clone git@github.com:drom/aerostat.git
cd aerostat
npm i
```

## Usage

### download

Download range of episodes into current folder.

#### Options:

  * `--min Number` start downloading with this number
  * `--max Number` last episode to download

```sh
cd <music folder>
<work>/aerostat/bin/download.js --min 496 --max 535
```

### chromecast

Play on Aerostat on chromecast device.

#### Options:

  * `--number Number` Aerostat Track number
  * `--device String` Chromecast device name
  * `--skip Number` Skip first N seconds of podcast (~35 sec is an intro.)

```sh
<work>/aerostat/bin/chromecast.js --number 496 --device <myChromeCastDeviceName>
```
