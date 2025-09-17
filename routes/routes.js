const express = require('express');

const router = new express.Router();
const controllers = require('../controllers/homeController');
const userControllers = require('../controllers/userController');
const {isAuthenticated, isAdmin} = require('../middlewares/auth');
const validate = require('../middlewares/validate')
const upload = require('../middlewares/upload');

// Project routes
router.get('/', controllers.homePage);
router.get('/activities', controllers.activitiesPage);
router.get('/api/activities', controllers.list);
router.get('/details', controllers.detailsPage);
router.get('/directory', controllers.directoryPage);
router.get('/contact', controllers.contactPage);
router.get('/activity_form', isAuthenticated, isAdmin, controllers.activityFormPage);
router.get('/activities/:id/edit', isAuthenticated, isAdmin, controllers.activityUpdatePage);
router.get('/register', userControllers.registerPage);
router.get('/login', userControllers.loginPage);
router.get('/logout', userControllers.logout);
router.get('/profile', isAuthenticated, userControllers.profilePage);

router.post('/activity_form', isAuthenticated, isAdmin, controllers.createActivity);
router.post('/register', validate.registrationRules, validate.check('/register'), userControllers.register);
router.post('/login', validate.loginRules, validate.check('/login'), userControllers.login);
// Esta ruta sube una foto y devuelve el link
router.post('/upload', upload.single('photo'), (req, res) => {
  res.json({ url: req.file.path }); // req.file.path es el link directo de Cloudinary
});

router.put('/activities/:id', upload.array('photos', 5), controllers.updateActivity);

router.delete('/api/activities/:id', isAuthenticated, isAdmin, controllers.deleteActivity);

module.exports = router;