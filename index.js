const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'saywan',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', (req, response) => {

  const queryString = 'SELECT * from pokemon'


  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {

      let context = {
        pokemon : result.rows
      }

      response.render('home', context);
    }
  });

});

app.get('/pokemon/:id', (req, response) => {
  let index = req.params.id;
  const queryString = 'SELECT * from pokemon where id =' + index;

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {

      let context = {
        pokemon : result.rows[0]
      }

      // redirect to home page
      response.render('Pokemon', context);
    }
  });

});

app.get('/new', (req, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('New');
});

app.get('/pokemon/:id/edit', (req, response) => {
  let index = req.params.id;
  const queryString = 'SELECT * from pokemon where id =' + index;

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {

      let context = {
        pokemon : result.rows[0]
      }

      // redirect to home page
      response.render('Edit', context);
    }
  });
});


app.post('/pokemon', (req, response) => {
  let params = req.body;

  const queryString = 'INSERT INTO pokemon(num, name, img, height, weight) VALUES($1, $2, $3, $4, $5)'
  const values = [params.num, params.name, params.img, params.height, params.weight];

  pool.query(queryString, values, (err, res) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', res);

      // redirect to home page
      response.redirect('/');
    }
  });
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
