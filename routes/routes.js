const express = require('express');

const router = new express.Router();
const controllers = require('../controllers/homeController');
const upload = require('../middlewares/upload');

// Project routes
router.get('/', controllers.homePage);
router.get('/activities', controllers.activitiesPage);
router.get('/api/activities', controllers.list)
router.get('/details', controllers.detailsPage);
router.get('/directory', controllers.directoryPage);
router.get('/contact', controllers.contactPage);
router.get('/activity_form', controllers.activityFormPage);
router.get('/activities/:id/edit', controllers.activityUpdatePage);

router.post('/activity_form', controllers.createActivity);

// Esta ruta sube una foto y devuelve el link
router.post('/upload', upload.single('photo'), (req, res) => {
  res.json({ url: req.file.path }); // req.file.path es el link directo de Cloudinary
});

router.put('/activities/:id', upload.array('photos', 5), controllers.updateActivity);

router.delete('/api/activities/:id', controllers.deleteActivity);

module.exports = router;