const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.urlencoded({ extended: false }));

app.listen(3000);
