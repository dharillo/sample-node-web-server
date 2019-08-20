const express = require('express');
const { join } = require('path');
const hbs = require('hbs');
const fs = require('fs');

const SERVER_PORT = process.env.PORT || 3000;

/**
 * Gets the current year
 *
 * @returns {number} Current year
 */
function getCurrentYear() {
  return new Date().getFullYear();
}

const app = express();

hbs.registerPartials(join(__dirname, 'views', 'partials'));
hbs.registerHelper('getCurrentYear', getCurrentYear);
hbs.registerHelper('upper', (text) => text.toUpperCase());

app.set('view engine', 'hbs');
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', `${log}\n`, (err) => {
    if (err) {
      console.error('Unable to append to server.log');
    }
  });
  next();
});
if (process.env.MAINTENANCE) {
  app.use((req, res) => {
    res.render('maintenance.hbs');
  });
}
app.use(express.static(join(__dirname, 'public')));

app
  .get('/', (_, res) => {
    res.render('home.hbs', {
      pageTitle: 'Home page',
      welcomeMessage: 'Welcome to the Learning Node.js Development homepage',
    });
  })
  .get('/about', (_, res) => {
    res.render('about.hbs', {
      pageTitle: 'About Page',
    });
  })
  .get('/bad', (_, res) => {
    res.json({ errorMessage: 'Unable to handle request' });
  })
  .get('/projects', ((_, res) => {
    res.render('projects.hbs', {
      pageTitle: 'Projects',
    });
  }));

app.listen(SERVER_PORT, () => {
  console.log(`Server is up on port ${SERVER_PORT}`);
});
