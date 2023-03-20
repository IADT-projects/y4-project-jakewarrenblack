const GPIO = require('onoff').Gpio;
const Buzzer = new GPIO(17, 'out');

const buzz = (req, res) => {
    const duration = 5000; // 5 seconds
    const frequency = 100; // 100ms on, 100ms off
    let intervalId = setInterval(() => {
        Buzzer.writeSync(Buzzer.readSync() ^ 1); // toggle the buzzer state
    }, frequency);
    setTimeout(() => {
        clearInterval(intervalId); // stop the buzzing after the duration has passed
        Buzzer.writeSync(0);
    }, duration);

    res.status(200).json({
        msg: 'buzzed!!!!'
    });
};

module.exports = {
    buzz,
};
