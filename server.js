// require express
var express = require("express");
// set up our project path
var path = require("path");
// require mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/QuotesDB');
// create the express app
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// Create a Schema for Quotes
var QuoteSchema = new mongoose.Schema({
    name: {type: String},
    quote: {type: String}
}, {timestamps: true})
// Store the Schema under the name 'Quote'
mongoose.model('Quote', QuoteSchema);
// Retrieve the Schema called 'Quote' and store it to the variable Quote
var Quote = mongoose.model('Quote');
// root route to render the index.ejs view
app.get('/', function(req, res) {
    res.render("index");
});
// post route for inserting the quote into the database
app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    // Try to save that new quote to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    quote.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
        console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the quotes route
        console.log('successfully added a quote!');
        res.redirect('/quotes');
    }
    })
});
app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes) {
        // Retrieve an array of quotes
        // This code will run when the DB is done attempting to retrieve all matching records to {}
        res.render('quotes', {quotes: quotes});
    })
});
// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});