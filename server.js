const express = require('express');
const { db } = require('./middleware/db');
const bodyParser = require('body-parser');
const { userRouter } = require('./routers/user.router');
const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log('Listening on port ', PORT);
})
db();
app.use(express.json({limit:'250mb'}));
app.use('/user',userRouter)
app.get('/',(req,res)=>{
res.send('Hello Broo/Sis!')
})