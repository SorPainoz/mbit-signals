# AGENTS.md

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles map 1:1 to default GitHub labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` at the root with ADRs in `docs/adr/`. `CONTEXT.md` already has a glossary (State/Rendering/Microbit/Controller/Remote/Boot) and `docs/adr/0001` locks in opaque wire codes — use that vocabulary and check the ADR before touching the wire protocol. See `docs/agents/domain.md`.

## Project state & gotchas

Early-stage micro:bit "on-call door signal". Three artifacts speak one protocol over BLE UART (Nordic UART Service, newline-framed commands `?STATE`/`MODE_A`/`MODE_B`; the micro:bit answers `STATE:<code>` and pushes it after every change):

- `firmware/` — pxt-microbit CLI project, **the source of truth for the protocol**. `firmware/main.ts`: boot → FREE (`MODE_B`), renders the 5x5 pattern, handles the UART commands. Build/flash via the root `Makefile` → `firmware/Makefile` (`pxt install` then `pxt build`/`deploy`/`console`/`test`): `make firmware`, `make flash` (micro:bit must be plugged in), `make firmware-console`, `make test`. Needs `pxt` installed globally (`npm install -g pxt`). Output is `firmware/built/binary.hex`. Hex files and `node_modules/`, `pxt_modules/`, `built/` are gitignored.
- `extension/` — phase-2 Chrome extension (MV3, no build): `manifest.json` + `popup.html` + `popup.js`. Load unpacked from `chrome://extensions`; the popup connects over the same UART protocol (`namePrefix: "BBC micro:bit"`). Subject to the Linux Web Bluetooth flag below — same Chromium engine as the debug page.
- `debug/` — WebBluetooth BLE debug tester: `index.debug.html`, served by `make serve` (or `npm run dev` in `debug/`) on `tcp://0.0.0.0:3000` (LAN-reachable — intentional so the son's machine can reach it; keep that binding). `make serve` auto-runs `npm install` in `debug/` when `serve` is missing. `discovery.py` scans BlueZ D-Bus for the micro:bit; it declares its `dbus-next` dependency via PEP 723 inline metadata, so run it with `uv run discovery.py`.
- `docs/references/mbit-remote-acess.research.md` — feasibility research (note the filename typo "acess") driving phase 2; read before touching the remote design.

Engineering setup traps:

- No tests, no lint, no typecheck, no CI. The root `Makefile` is the whole workflow; the npm manifest lives in `debug/package.json` (devDependency: `serve` only).
- `pxt build` does **not** auto-install dependencies: a fresh clone (or cleared `firmware/pxt_modules/`) fails with `Package not installed: core`. Always go through the root `Makefile` (its targets run `pxt install` first), never bare `pxt build` in `firmware/`.
- `pxt install` re-adds the `microphone` package to `firmware/pxt.json` (target default). Unused but expected — don't fight it.
- Web Bluetooth is **off by default in Chrome on Linux** (Chromium marks it `experimental`), so `navigator.bluetooth` is `undefined` even on localhost. Fix: enable `chrome://flags/#enable-experimental-web-platform-features`, or launch Chrome with `--enable-features=WebBluetooth`. Affects both the debug page and the extension popup (same engine). The user-level launcher at `~/.local/share/applications/google-chrome.desktop` carries the flag — terminal/scripted Chrome launches don't. Also: `serve` answers every reload with a `304` (ETag handshake); normal, not an error.
- Plan and scope live in `README.md` (phases 1–2 + future work) — source of truth for intent.

Workflow: issues/specs are GitHub issues via `gh`; follow the triage-label and domain-doc conventions above. `CONTEXT.md`/`docs/adr/` already exist — extend them as terms or decisions resolve.
