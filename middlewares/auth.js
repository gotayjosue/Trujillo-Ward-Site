function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash('error_msg', 'You must log in first.');
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Admins only.');
  res.redirect('/'); 
}

module.exports = { isAuthenticated, isAdmin };