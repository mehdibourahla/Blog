var bodyParser          = require('body-parser'),
      mongoose          = require('mongoose'),
       express          = require('express'),
       Blog             = require('./models/blog'),
       User             = require('./models/user'),
       seedDB           = require('./seeds'),
       methodOverride   = require('method-override'),
       expressSanitizer = require("express-sanitizer");
       passport         = require('passport'),
       LocalStrategy    = require('passport-local'),
       passportLocalMongoose = require('passport-local-mongoose'),
       middleware            = require('./middleware')
       indexRoutes           = require('./routes/index'),
       commentRoutes         = require('./routes/comments'),
       blogRoutes            = require('./routes/blogs'),
       flash                 = require('connect-flash');

var dburl = process.env.DATABASEURL || "mongodb://localhost/blog";
mongoose.connect(dburl, {useNewUrlParser: true});


var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

//PASPPORT CONFIG
app.use(require('express-session')({      //COMES FIRST!Require express-session and telling to express to use it 
	secret: "Something i don't know yet", //We need to fill some data inside
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize()); // We need this two lines
app.use(passport.session());    // Anytime we use passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     //This two methods are used to take(put) data 
passport.deserializeUser(User.deserializeUser()); //from(in) session and coding(decoding) it.

app.use(function(req,res,next){
    res.locals.currentUser = req.user; //currentUser or whatever you want
    res.locals.dangerFlash  = req.flash("danger");
    res.locals.successFlash  = req.flash("success");
    next();
  });
//seedDB();

app.use(indexRoutes);
app.use("/blogs",blogRoutes);
app.use("/blogs/:blogid/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER ON");
}); 