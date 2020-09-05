const express=require('express');
const connectDB=require('./Config/db');
const app=express();
//connecting to database
connectDB();

//Init MiddleWare
app.use(express.json({extended:false}));

app.get('/',(req,res)=>res.send('API running'));

//Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log('Server started listening on '+PORT));

