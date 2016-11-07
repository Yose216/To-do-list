var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.use(express.static('public'));

// On utilise les sessions
app.use(session({secret: 'todotopsecret'}))

// Verifie que ya aucune session
app.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})

// Gestion des routes en-dessous
app.get('/todo', function(req, res) {
	res.render('index.ejs', {todolist: req.session.todolist});
});

app.post('/todo/create', urlencodedParser, function(req, res) {
	if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
	res.redirect('/todo');
});

app.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

app.use(function(req, res, next){
    res.redirect('/todo');
});

app.listen(8080);
