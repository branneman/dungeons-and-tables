const rpio = require('rpio')

const PIN_SCROLLLOCK = 12
const PIN_PLUS = 13
const PIN_MINUS = 14

const uinput = fs.createWriteStream('/dev/uinput')

/**
 * ScrollLock key: switch behaviour
 */
rpio.mode(PIN_SCROLLLOCK, rpio.INPUT)
rpio.poll(
  PIN_UP,
  function cbScrolllock() {
    uinput.write('KEY_SCROLLLOCK')
  },
  rpio.POLL_BOTH
)

/**
 * Up key: single key stroke
 */
rpio.mode(PIN_PLUS, rpio.INPUT)
rpio.poll(
  PIN_PLUS,
  function cbPlus() {
    uinput.write('KEY_KPPLUS')
  },
  rpio.POLL_HIGH
)

rpio.mode(PIN_MINUS, rpio.INPUT)
rpio.poll(
  PIN_MINUS,
  function cbMinus() {
    uinput.write('KEY_KPMINUS')
  },
  rpio.POLL_HIGH
)
