const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activity: { type: String, required: true },
  date: { type: String, required: true }, // formato YYYY-MM-DD
  time: { type: String, required: true },
  location: { type: String, required: true },
  org: { type: String, required: true },
  responsible: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  photos: [
    {
      url: String,
      public_id: String
    }
  ]
});

module.exports = mongoose.model('Activity', activitySchema);