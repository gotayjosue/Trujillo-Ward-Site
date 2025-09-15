const express = require('express');
const app = express();
const routes = require('./routes/routes');
const pool = require('./models/database');
const { connectToDatabase } = require('./models/database');
const methodOverride = require('method-override');



// Set up view engine
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



// Connect to the database before starting the server

connectToDatabase()
  .then(() => {
    app.use("/", routes);

    // ...tus otras rutas (EJS, auth, etc)
    // app.set("view engine", "ejs"); app.set("views", "./views");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("No se pudo conectar a MongoDB:", e);
    process.exit(1);
  });

app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});


//Routes





