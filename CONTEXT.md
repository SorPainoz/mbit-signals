# MicrobitSignals

A door signal built on a micro:bit V2: it renders a State on the 5x5 LED matrix so the family can read at a glance whether my son is free to be disturbed.

## Language

**State**:
The door-signal entity: a wire code (`MODE_A`/`MODE_B`), a label (`ON-CALL`/`FREE`), and a rendering (fixed 5x5 LED pattern). Wire speaks codes, UI speaks labels, the door shows renderings.
_Avoid_: signal, mode, status

**Rendering**:
The fixed 5x5 LED presentation of a State.

**Microbit**:
Source of truth. Holds the current State in memory, renders it, answers `?STATE`, and pushes `STATE:<code>` after any change.
_Avoid_: device, board

Its BLE UART service (Nordic UART, `6e400001`) **reverses the standard Nordic characteristic ids**: clients write commands to `6e400003`, and subscribe to `6e400002` (indications). Not the `RX`/`TX` convention most UART examples assume.

**Controller**:
Physical buttons or the Chrome extension; last write wins.
_Avoid_: remote control, client

**Remote**:
The son's Chrome extension popup over BLE UART.
_Avoid_: chrome extension (verbatim), app

**Boot**:
Power-on splash, then settles on FREE (`MODE_B`).
