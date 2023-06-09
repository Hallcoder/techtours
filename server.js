const express = require('express');
const { db } = require('./middleware/db');
const bodyParser = require('body-parser');
const { Swaggiffy, registerDefinition } = require('swaggiffy'); // Using require
const { userRouter } = require('./routers/user.router');
const { User } = require('./models/user.schema');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json({limit:'250mb'}));
app.use('/user',userRouter)
app.get('/',(req,res)=>{
    res.send('Hello Broo/Sis!')
})
app.listen(PORT,()=>{
    console.log('Listening on port ', PORT);
    db();
})
new Swaggiffy().setupExpress(app).swaggiffy();