# Wire protocol speaks opaque state codes, not domain labels

The remote-control wire protocol uses opaque codes (`MODE_A`, `MODE_B`) over BLE UART instead of domain labels (`FREE`, `ON_CALL`). We considered domain-aligned commands but kept the prototype's codes because they already work end-to-end, and the micro:bit firmware (MakeCode) is versioned by hand — every rename costs a re-flash and a re-sync with the extension. Labels stay a UI-layer concern; the extension maps codes to labels. Future states are additive (a new code), never a rename of an existing one.
