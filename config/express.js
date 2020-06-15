const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

module.exports = (app) => {
    app.use(cookieParser())
    //Setup the view engine
    app.engine('.hbs', handlebars({
        extname: ".hbs"
    }));
    app.set('view engine', '.hbs');

    //Setup the body parser
    app.use(express.urlencoded())

    //Setup the static files
    app.use('/static', express.static('./static'))

};