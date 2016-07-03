# aerostat

[aerostat](http://www.aquarium.ru/misc/aerostat/) radio podcast download tools

## Install

```sh
cd <work>
git clone git@github.com:drom/aerostat.git
cd aerostat
npm i
```

## Usage

Download range of episodes. From <min> to <max>

```sh
cd <music folder>
<work>/aerostat/bin/download.js --min 496 --max 535
```

Play on chromecast

```sh
<work>/aerostat/bin/chromecast.js --number 496 --device <myChromeCastDeviceName>
```
