//IMPORTS FROM PACKAGES
const express = require('express');
const mongoose = require('mongoose');

//Imports from other files
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

//Init
const PORT = process.env.PORT || 3000;
const app = express();
const DB = "mongodb+srv://alanashu07:Iammuhammedanas7@cluster0.fldhcbm.mongodb.net/?retryWrites=true&w=majority"

//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//connections
mongoose
    .connect(DB)
    .then(()=> {
        console.log('Connection Successful');
})
    .catch(e => {
        console.log(e);
    });

app.listen(PORT, "0.0.0.0", ()=> {
    console.log (`connected at port ${PORT}`);
});

