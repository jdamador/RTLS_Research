var SerialPort = require('serialport');
var serialPort = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});
serialPort.on('data', function (data) {
    console.log('Data:', data);
});
/*
serialPort.on('readable', function () {
    console.log('Data:', port.read());
});*/
