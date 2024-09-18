const express = require('express');
const cors = require('cors');
const db = require('./models');
const {AllRouters}= require('./Router.js');
const path = require('path');
const dotenv = require('dotenv')
require('./utility/scheduler.js')
dotenv.config();
const app = express();


app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cors())
// app.use('/photoStore', express.static(path.join(__dirname, 'photoStore')));
// app.use('/videoStore', express.static(path.join(__dirname, 'videoStore')));

app.use('/api',AllRouters)

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});