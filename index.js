const express = require('express');
const app = express();
const server = require('http').Server(app);
const net = require('net');
const pty = require('node-pty');
const WebSocket = require('ws');

app.use('/', express.static('.'));
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.send('Hi there, I am a WebSocket server');
    let ptyProcess = pty.spawn('bash', ['--login'], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env
    });
    ptyProcess.on('data', data => ws.send(JSON.stringify({"output": data})));
    ws.on('message', (message) => {
        console.log('received: %s', message);
	m = JSON.parse(message)

	if(m.input){
	  ptyProcess.write(m.input)
	}else if(m.resize){
          ptyProcess.resize(m.resize[0], m.resize[1])
	}
    });
});

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
