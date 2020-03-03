// Import packages to create the server.
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

// Create server.
const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);

// Start server.
app.use(express.static(__dirname + '/public'));
server.listen('3000', () => console.log('Server on port 3000'));

// Import packages to use SPI.
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

// Open serial port communication.
const port = new SerialPort("/dev/ttyACM0", {
    baudRate: 115200
});
// Set delimiter to know when a new line starts.
const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }));

// Open the connection.
parser.on('open', function () {
    console.log('connection is opened');
});

// Read data from Serial Port
parser.on('data', function (data) {
    console.log(data)
    let location = data.split(",");
    io.emit('location', { "location": location })
});

parser.on('error', (err) => console.log(err));
port.on('error', (err) => console.log(err));

