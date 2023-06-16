const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport=require('passport');
const session = require('express-session');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const Appointment = require('./models/appointment');
const Prescription=require('./models/prescription');
const HealthLog = require('./models/healthlog');
const Symptomjournal = require('./models/symptom');
const Doctor=require('./models/doctor');
const { cannotHaveAUsernamePasswordPort } = require('whatwg-url');
const { isLoggedIn} = require('./middleware');

mongoose.connect('mongodb://localhost:27017/health-tracker');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



app.use(session(sessionConfig));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));  

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    next();
})

app.listen(3000,()=>{
    console.log('serving on port 3000')
})

app.get('/',(req,res)=>{
    res.render('home')
})



app.get('/appointment',isLoggedIn,(req,res)=>{
    res.render('appointment/appointmentindex')
})

app.post('/appointment',(req,res)=>{
    const appointment=new Appointment(req.body);
    appointment.author=req.user._id;
    appointment.save();
    res.redirect('/');
})

app.get('/appointmentlist',isLoggedIn,async(req,res)=>{
    const appointments = await Appointment.find({});
    res.render('appointment/show',{appointments})
})

app.get('/prescriptionlist',isLoggedIn,async(req,res)=>{
    const prescriptions = await Prescription.find({});
    res.render('prescription/show',{prescriptions})
})

app.get('/prescription',isLoggedIn,(req,res)=>{
    res.render('prescription/prescriptionindex')
})

app.post('/prescription',(req,res)=>{
    const prescription=new Prescription(req.body);
    prescription.author=req.user._id;
    prescription.save();
    res.redirect('/');
})


 
app.get('/doctorNclinic',isLoggedIn,(req,res)=>{
    res.render('doctornclinic/doctor');
})
app.post('/doctorNclinic',(req,res)=>{
    const doctor=new Doctor(req.body);
    doctor.author=req.user._id;
    doctor.save();
    
    res.redirect('/');
})

app.get('/doctorlist',isLoggedIn,async(req,res)=>{
    const doctorlist=await Doctor.find({});
    res.render('doctornclinic/doctorlist',{doctorlist});
})

app.get('/healthlog',isLoggedIn,(req,res)=>{
    res.render('healthlog/healthlogindex'); 
})

app.post('/healthlog',(req,res)=>{
    const healthlog=new HealthLog(req.body);
    healthlog.author=req.user._id;
    healthlog.save();
    res.redirect('/');
})

app.get('/healthloglist',isLoggedIn,async(req,res)=>{
    const healthlogs = await HealthLog.find({});
    res.render('healthlog/show',{healthlogs})
})

app.get('/symptom',isLoggedIn,(req,res)=>{
    res.render('symptom/symptomindex'); 
})

app.post('/symptom',(req,res)=>{
    const symptom=new Symptomjournal(req.body);
    symptom.author=req.user._id;
    symptom.save();
    res.redirect('/');
})

app.get('/symptomlist',isLoggedIn,async(req,res)=>{
    const symptoms = await Symptomjournal.find({});
    res.render('symptom/show',{symptoms})
})

app.get('/register',(req,res)=>{
    res.render('users/register');
});


app.post('/register', async (req, res, next) => {
    try {
       
        const { email,name, username, password } = req.body;
        

        const user = new User({ email,name,username,password });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            //req.flash('success', 'MESS!!');
            console.log(req.body)
            res.redirect('/');
            
        })

    } catch (e) {
        //req.flash('error', e.message);
        res.redirect('/register');
    }
});


app.get('/login',async(req,res)=>{
    res.render('users/login')
})

app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{

    //req.flash('success','welcome back!! you are successfully logged in');
const redirectUrl = req.session.returnTo || '/';
delete req.session.returnTo;
res.redirect(redirectUrl);
})


app.get('/logout', (req, res) => {
    req.logout();
    //req.flash('success', "Goodbye!");
    res.redirect('/');
})