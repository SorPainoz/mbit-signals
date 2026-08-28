const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHAR = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHAR = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const CODES_TO_LABELS = { MODE_A: "ON-CALL", MODE_B: "FREE" };
const LABELS_TO_CODES = { "ON-CALL": "MODE_A", "FREE": "MODE_B" };

let rxCharacteristic;

const statusEl = document.getElementById("status");
const stateLabelEl = document.getElementById("stateLabel");
const connectBtn = document.getElementById("connectBtn");
const btnOnCall = document.getElementById("btnOnCall");
const btnFree = document.getElementById("btnFree");

function setConnected(connected) {
  const on = connected === true;
  connectBtn.disabled = on;
  btnOnCall.disabled = !on;
  btnFree.disabled = !on;
  statusEl.textContent = on ? "Connected" : "Disconnected";
  if (!on) stateLabelEl.textContent = "Unknown";
}

function setStateLabel(code) {
  stateLabelEl.textContent = CODES_TO_LABELS[code] || code;
}

function encodeCommand(command) {
  return new TextEncoder().encode(command + "\n");
}

async function sendCommand(command) {
  if (!rxCharacteristic) return;
  await rxCharacteristic.writeValue(encodeCommand(command));
}

connectBtn.addEventListener("click", async () => {
  statusEl.textContent = "Requesting Bluetooth device...";
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE]
    });

    statusEl.textContent = "Connecting...";
    const server = await device.gatt.connect();

    const service = await server.getPrimaryService(UART_SERVICE);
    rxCharacteristic = await service.getCharacteristic(UART_RX_CHAR);
    const txCharacteristic = await service.getCharacteristic(UART_TX_CHAR);

    await txCharacteristic.startNotifications();
    txCharacteristic.addEventListener("characteristicvaluechanged", (e) => {
      const value = new TextDecoder().decode(e.target.value).trim();
      if (value.startsWith("STATE:")) setStateLabel(value.split(":")[1]);
    });

    setConnected(true);
    await sendCommand("?STATE");
  } catch (error) {
    statusEl.textContent = "Error: " + error.message;
    setConnected(false);
  }
});

btnOnCall.addEventListener("click", () => sendCommand(LABELS_TO_CODES["ON-CALL"]));
btnFree.addEventListener("click", () => sendCommand(LABELS_TO_CODES["FREE"]));
