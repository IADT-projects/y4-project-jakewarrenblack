const GPIO = require('onoff').Gpio
const Buzzer = new GPIO(17, 'out');

const stopBuzzing = () => {
    clearInterval(buzzInterval)
    Buzzer.writeSync(0)
    Buzzer.unexport()
}

const buzz = () => {
    for(var i=0; i<5; i++){
        if(Buzzer.readSync() === 0){
            Buzzer.writeSync(1)
        }
        else{
            Buzzer.writeSync(0)
        }
    }
    stopBuzzing()
}

module.exports = {
    buzz,
}

