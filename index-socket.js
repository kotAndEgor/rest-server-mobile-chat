const http = require('http');

const server = http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
  };
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }
  if (['GET', 'POST'].indexOf(req.method) > -1) {
    res.writeHead(200, headers);
    res.end('Hello World');
    return;
  }
  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
});

const io = require('socket.io')(server);
const port = 3000;
server.listen(port, (err) => {
  if (err) { return console.log('something bad happened', err); };
  console.log(`Sockets-server listening on ${port}`);
})
let messages = [
  // { from: 'asdfasdf', message: '11212', time: '1560756467835' },
];

io.on('connection', function (socket) {
  socket.emit('messages-from-server', messages);
  
  socket.on('message-from-client', function (data) {
    if(messages.length > 150) { // limit 150 messages
      messages.shift();
    }
    messages.push(data);
    socket.broadcast.emit('message-from-server', data);
    socket.emit('message-from-server', data);
  });
});

