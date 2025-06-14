const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  versions: [versionSchema]
}, {
  timestamps: true
});

// Method to add a new version
noteSchema.methods.addVersion = async function(content) {
  const nextVersion = this.versions.length + 1;
  this.versions.push({
    version: nextVersion,
    content,
    timestamp: new Date()
  });
  return this.save();
};

// Method to get latest version
noteSchema.methods.getLatestVersion = function() {
  return this.versions[this.versions.length - 1];
};

// Method to get specific version
noteSchema.methods.getVersion = function(versionNumber) {
  return this.versions.find(v => v.version === versionNumber);
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note; 