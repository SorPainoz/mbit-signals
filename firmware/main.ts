const MODE_ON_CALL = "MODE_A"
const MODE_FREE = "MODE_B"

let currentState = ""

function respondState() {
    bluetooth.uartWriteString("STATE:" + currentState)
}

function setState(state: string) {
    currentState = state
    renderState()
    respondState()
}

function renderState() {
    if (currentState == MODE_ON_CALL) {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        basic.showLeds(`
            . . . . #
            . . . # .
            # . # . .
            . # . . .
            . . . . .
            `)
    }
}

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    const receivedCommand = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

    if (receivedCommand == "?STATE") {
        respondState()
    } else if (receivedCommand == MODE_ON_CALL) {
        setState(MODE_ON_CALL)
    } else if (receivedCommand == MODE_FREE) {
        setState(MODE_FREE)
    }
})

currentState = MODE_FREE
bluetooth.startUartService()
renderState()
