const express = require ('express');
const passport= require("passport")
const session = require("express-session")
const app = express ();
const path = require('path');

require("./auth");

function islog(req,res,next){
    req.user ? next(): res.sendStatus(401);
}

app.use(express.json ());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile ('index.html');
});

app.use(session({
    secret: 'mysec',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure', (req,res)=>{
    res.send("OOPS!")
})
app.get('/auth/protected',islog, (req, res) => {
    let name = req.user.displayName;
    res.send("Hello " + name);
});

app.use('/auth/logout',(req,res)=>{
    req.session.destroy();
    res.send('Au revoir!');
})

app.listen (3000, () => {
    console.log('Listening on port 3000');
});