const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
// NOTE: the micro:bit's codal UART service REVERSES the standard Nordic
// UART characteristic ids: write commands to 6e400003, subscribe to 6e400002.
const UART_WRITE_CHAR = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const UART_SUBSCRIBE_CHAR = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

const CODES_TO_LABELS = { MODE_A: "ON-CALL", MODE_B: "FREE" };
const LABELS_TO_CODES = { "ON-CALL": "MODE_A", "FREE": "MODE_B" };

let writeCharacteristic;

const statusEl = document.getElementById("status");
const stateLabelEl = document.getElementById("stateLabel");
const connectBtn = document.getElementById("connectBtn");
const btnOnCall = document.getElementById("btnOnCall");
const btnFree = document.getElementById("btnFree");

if (!navigator.bluetooth) {
  statusEl.textContent =
    "Web Bluetooth unavailable: enable chrome://flags/#enable-experimental-web-platform-features (Linux) and relaunch.";
  connectBtn.disabled = true;
}

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
  if (!writeCharacteristic) return;
  await writeCharacteristic.writeValue(encodeCommand(command));
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
    writeCharacteristic = await service.getCharacteristic(UART_WRITE_CHAR);
    const subscribeCharacteristic = await service.getCharacteristic(UART_SUBSCRIBE_CHAR);

    await subscribeCharacteristic.startNotifications();
    subscribeCharacteristic.addEventListener("characteristicvaluechanged", (e) => {
      const value = new TextDecoder().decode(e.target.value).trim();
      if (value.startsWith("STATE:")) setStateLabel(value.split(":")[1]);
    });

    setConnected(true);
    await sendCommand("?STATE");
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Error: " + error.message;
  }
});

btnOnCall.addEventListener("click", () => sendCommand(LABELS_TO_CODES["ON-CALL"]));
btnFree.addEventListener("click", () => sendCommand(LABELS_TO_CODES["FREE"]));
