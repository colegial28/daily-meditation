const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

require('dotenv').config();




const app = express();
const port = process.env.PORT || 5000;



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors());
app.use(
	session({
		secret: 'daniel',
		resave: false,
		saveUninitialized: false
	})
);
// this is x-www-form-urlencoded <form>
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());




// accept api request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // routers
 const indexRouter = require('./routes/index');

 // matching router with routes
 app.use('/', indexRouter);



// mongo connection
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
   
});
