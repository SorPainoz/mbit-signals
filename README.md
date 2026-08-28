# MicrobitSignals

## Context & Problem statement

My son is playing online with his friends and I want avoid accidentaly popping by.
Therefore we tought about adding a signal to his door.
Because we have a Microbit V2 sitting around, we decided to leverage its display (led matrix 5x5) to show the signals.


## Mission: Allow my son to signal if he's on call

## Success looks like
A microbit is powered and "attached" to my son's door and he can control what's shown on the display.

## Constraints
n/a

## Not in scope
n/a

## Multiphase Plan towards MVP

### 1. Microbit has two states FREE and ON-CALL that can be rendered on its screen. A state can be selected via the phisical buttons present on the Microbit.
JS Implementation from my son is available at [firmaware.v1.js](docs/prototypes/firmaware/firmaware.v1.js)

### 2. My son can interact with the Microbit via a chrome extension instead of using the phisical buttons

Feasibility needs to be evaluated, in fact the design was driven by what I learned from a [chat with Gemini](docs/requirements/mbit-remote-acess.research.md).

There is a web page(prototype) available at [web.v1](docs/prototypes/web.v1/index.html) and relative prototyped firmware at [firmaware.v2.js](docs/prototypes/firmaware/firmaware.v2.js). The CLI-native firmware implementing this protocol lives in [`firmware/`](firmware/) (`firmware/main.ts`) and is built/flashed with `make firmware` / `make flash`.

> Note: on Linux, Chrome ships Web Bluetooth off by default (an `experimental` feature), so `navigator.bluetooth` is undefined even on localhost. Enable `chrome://flags/#enable-experimental-web-platform-features` or launch Chrome with `--enable-features=WebBluetooth`. See `AGENTS.md` for the full trap list.


## Future work/ideas

- Add more states
- Allow my son to draw what it will show on the display.
- A mood signal
- Mobile client/web app
- Wire mIcrobit with additional components (low fidelity)
