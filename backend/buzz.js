const GPIO = require('onoff').Gpio
const Buzzer = new GPIO(17, 'out');

const buzz = () => {
    for(var i=0; i<30; i++){
        if(Buzzer.readSync() === 0){
            Buzzer.writeSync(1)
        }
        else{
            Buzzer.writeSync(0)
        }
    }
}

module.exports = {
    buzz
}

