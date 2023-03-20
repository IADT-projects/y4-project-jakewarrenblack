const GPIO = require('onoff').Gpio
const Buzzer = new GPIO(17, 'out');

const buzz = async () => {
    Buzzer.writeSync(1)
}

const noBuzz = async () => {
    Buzzer.writeSync(0)
}

module.exports = {
    buzz,
    noBuzz
}

