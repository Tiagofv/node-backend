var createError = require('http-errors')
var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var db = require('./database/db')

app.use(cors())
app.options('*', cors())
//escolhemos a porta 3100 como padrão
const port = process.env.PORT || '3100'

// view engine setup
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

//importamos as rotas 
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use(bodyParser.json())

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})


// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, _) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

// Inicia  o servidor
app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port}`)
})
//finaliza o processo caso acabe
process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });


module.exports = app