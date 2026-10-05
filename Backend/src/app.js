const express = require('express');
const app = express();
const authRouter = require('./routes/auth.routes');
const interviewRoute = require('./routes/interview.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');


app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter);
app.use('/api/interview',interviewRoute);

module.exports = app;