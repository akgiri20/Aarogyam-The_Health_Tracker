//const flash=require('connect-flash');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        //req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// module.exports.iscorrectuser = async (req, res, next) => {
//     if (req.user === ) {
//         next();
//     } else {
//         req.flash('error', 'You are not an admin');
//         return res.redirect("/login");
//     }
// }
