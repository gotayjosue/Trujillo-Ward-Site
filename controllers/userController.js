const User = require('../models/User');

function profilePage(req, res) {
  res.render('profile', 
    { user: req.session.user.name, 
      role: req.session.user.role,
      email: req.session.user.email
    });
}
function registerPage(req, res) {
  res.render('register'); // tu vista register.ejs
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email already registered.');
      return res.redirect('/register');
    }

    // Crear usuario nuevo
    const user = new User({ name, email, password });
    await user.save();

    req.flash('success_msg', 'Account created! You can log in now.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error registering user.');
    res.redirect('/register');
  }
}

// Mostrar página de login
function loginPage(req, res) {
  res.render('login'); // tu vista login.ejs
}

// Procesar login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/login');
    }

    // Comparar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials.');
      return res.redirect('/login');
    }

    // Guardar sesión
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.flash('success_msg', 'Welcome back!');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error logging in.');
    res.redirect('/login');
  }
}

// Logout
function logout(req, res) {
  req.flash('success_msg', 'Logged out successfully.');
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.redirect('/activities');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
}

module.exports = {
  registerPage,
  register,
  loginPage,
  profilePage,
  login,
  logout
};