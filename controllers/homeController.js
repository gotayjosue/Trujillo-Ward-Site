const { getCollection } = require("../models/database");
const { ObjectId } = require("mongodb");
const cloudinary = require("../config/cloudinary");

async function list(req, res) {
  try {
    const activities = await getCollection("activities")
      .find({}) 
      .sort({ date: 1 }) // "YYYY-MM-DD" ordena bien como string
      .toArray();

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo actividades" });
  }
};

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
    const activityId = req.params.id; // mejor usar params, ej: /activities/:id/edit
    const activities = getCollection('activities');
    const activity = await activities.findOne({ _id: new ObjectId(activityId) });

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
    const {
      activity,
      date,
      time,
      location,
      org,
      responsible,
      description
    } = req.body;

    // Convertir completed a boolean real
    let completed = req.body.completed === 'true';

    // -----------------------------
    // 1. Fotos antiguas (JSON.parse de cada hidden input)
    // -----------------------------
    let oldPhotos = req.body.oldPhotos || [];
    if (!Array.isArray(oldPhotos)) oldPhotos = [oldPhotos];

    oldPhotos = oldPhotos.map(p => {
      try {
        return JSON.parse(p); // viene de JSON.stringify(photo) en EJS
      } catch {
        return { url: p, public_id: null }; // fallback si alguna viene como string
      }
    });

    // -----------------------------
    // 2. Fotos nuevas subidas
    // -----------------------------
    let newPhotos = (req.files || []).map(f => ({
      url: f.path,         // link público de Cloudinary
      public_id: f.filename // ID único en Cloudinary
    }));

    // -----------------------------
    // 3. Fotos a borrar
    // -----------------------------
    let deletePhotos = req.body.deletePhotos || [];
    if (!Array.isArray(deletePhotos)) deletePhotos = [deletePhotos];

    // Eliminar de Cloudinary las fotos seleccionadas
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

    // Mantener solo las fotos que no se marcaron para borrar
    let remainingPhotos = oldPhotos.filter(
      p => !deletePhotos.includes(p.public_id)
    );

    // -----------------------------
    // 4. Combinar y guardar
    // -----------------------------
    const photos = [...remainingPhotos, ...newPhotos];

    const activities = getCollection('activities');

    await activities.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          activity,
          date,
          time,
          location,
          org,
          responsible,
          description,
          completed,
          photos
        }
      }
    );

    res.redirect('/activities');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating activity');
  }
}

activityFormPage = (req, res) => {
  res.render('activity_form');
};

createActivity = async (req, res) => {
  const { activity, date, time, location, org, responsible, description } = req.body;
  try {
    const activities = getCollection('activities');
    await activities.insertOne({
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
    res.redirect('/activities');
  } catch (err) {
    res.status(500).send('Error saving activity');
  }
};

async function deleteActivity(req, res) {
  try {
    const activities = getCollection('activities');
    const result = await activities.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Deleted' });
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting activity' });
  }
}

module.exports = { homePage, activitiesPage, detailsPage, directoryPage, contactPage, list, activityFormPage, createActivity, deleteActivity, activityUpdatePage, updateActivity };