const Activity = require("../models/Activity");
const cloudinary = require("../config/cloudinary");

async function list(req, res) {
  try {
    const activities = await Activity.find().sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo actividades" });
  }
}

function homePage(req, res) {
  res.render('index', { weatherApiUrl: process.env.WEATHER_API_URL });
}

function activitiesPage(req, res) {
  res.render('activities');
}

function detailsPage(req, res) {
  res.render('details');
}

function directoryPage(req, res) {
  res.render('directory');
}

function contactPage(req, res) {
  res.render('contactUs');
}

async function activityUpdatePage(req, res) {
  try {
    const activityId = req.params.id;
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).send('Actividad no encontrada');
    }

    res.render('activity_update', { activity });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error cargando la actividad');
  }
}

async function updateActivity(req, res) {
  try {
    const { activity, date, time, location, org, responsible, description } = req.body;
    let completed = req.body.completed === 'true';

    // Fotos antiguas
    let oldPhotos = req.body.oldPhotos || [];
    if (!Array.isArray(oldPhotos)) oldPhotos = [oldPhotos];
    oldPhotos = oldPhotos.map(p => {
      try {
        return JSON.parse(p);
      } catch {
        return { url: p, public_id: null };
      }
    });

    // Fotos nuevas
    let newPhotos = (req.files || []).map(f => ({
      url: f.path,
      public_id: f.filename
    }));

    // Fotos a borrar
    let deletePhotos = req.body.deletePhotos || [];
    if (!Array.isArray(deletePhotos)) deletePhotos = [deletePhotos];

    for (const publicId of deletePhotos) {
      if (publicId && publicId !== 'null') {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Borrada de Cloudinary: ${publicId}`);
        } catch (err) {
          console.error(`Error borrando ${publicId}:`, err);
        }
      }
    }

    let remainingPhotos = oldPhotos.filter(
      p => !deletePhotos.includes(p.public_id)
    );

    const photos = [...remainingPhotos, ...newPhotos];

    await Activity.findByIdAndUpdate(req.params.id, {
      activity,
      date,
      time,
      location,
      org,
      responsible,
      description,
      completed,
      photos
    });

    res.redirect('/activities');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating activity');
  }
}

function activityFormPage(req, res) {
  res.render('activity_form');
}

async function createActivity(req, res) {
  const { activity, date, time, location, org, responsible, description } = req.body;
  try {
    const newActivity = new Activity({
      activity,
      date,
      time,
      location,
      org,
      responsible,
      description,
      completed: false,
      photos: []
    });
    await newActivity.save();
    res.redirect('/activities');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving activity');
  }
}

async function deleteActivity(req, res) {
  try {
    const result = await Activity.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Deleted' });
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting activity' });
  }
}

module.exports = {
  homePage,
  activitiesPage,
  detailsPage,
  directoryPage,
  contactPage,
  list,
  activityFormPage,
  createActivity,
  deleteActivity,
  activityUpdatePage,
  updateActivity
};