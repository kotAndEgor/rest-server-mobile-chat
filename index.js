const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const users = require('./users');
const jwt = require('jsonwebtoken');

app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// попадает в коммит, т. к. проект по учебе
const secret = 'KJasdiofsj*(*(SAdakld923l1k23';

app.get('/api/users', function (req, res) {
  (req.query.password === 'Lsalkdasj290sdfklKL') ?
    res.status(200).send(users) :
    res.status(500).send({ error: 'Access denied' });
});

app.post('/api/login', function (req, res) {
  const login = req.body.login;
  const password = req.body.password;
  console.log(login, password);
  console.log(users.find(el => el.login === login && el.password === password));
  if(
    login.length > 1 &&
    login.length < 20 &&
    password.length > 1 &&
    password.length < 20
  ) {
    users.find(el => el.login === login && el.password === password) ?
      res.status(200).send({ status: 'ok', token: jwt.sign({ login, password }, secret) }) :
      res.status(500).send({ error: 'Access denied' });
  } else {    
    res.status(500).send({ error: 'Access denied, miss login or password' });
  }
});

app.post('/api/token', function (req, res) {
  const token = req.body.token;
  const { login, password } = jwt.verify(token, secret);
  users.find(el => el.login === login && el.password === password) ?
    res.status(200).send({ status: 'ok', token: jwt.sign({ login, password }, secret) }) :
    res.status(500).send({ error: 'Access denied' });
});

const port = 8088;
app.listen(port, function () {
  console.log(`Rest-server listening on ${port}`);
});