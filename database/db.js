const mongoose = require('mongoose')

// MONGODB
mongoose.connect('mongodb+srv://angular:angular@cluster0-odsd5.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true
})