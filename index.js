const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: false}))

//Middleware
const checkNome = (req, res, next) => {
  const nome = req.param('nome');
  if(nome === ''){
    res.redirect('/')
  }else{
    next();
  }
}

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const dados = req.body;
  const DATA_NASCIMENTO = dados.data_nascimento;
  const idade = moment().diff(moment(DATA_NASCIMENTO, "DD/MM/YYYY"), 'years');
  if (idade < 18) {
    res.redirect('/minor?nome='+dados.nome);
  } else {
    res.redirect('/major?nome='+dados.nome);
  }
});

app.get('/major', checkNome, (req, res) => {
  const nome = req.param('nome');
  res.render('major', {nome});
});

app.get('/minor', checkNome, (req, res) => {
  const nome = req.param('nome');
  res.render('minor', {nome});
});

app.listen(3000);
