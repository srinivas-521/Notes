const Note = require('../models/Note');

// Create new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      userId: req.user._id,
      title,
      versions: [{
        version: 1,
        content,
        timestamp: new Date()
      }]
    });

    await note.save();
    res.status(201).json({
      message: 'Note created successfully',
      note: {
        id: note._id,
        title: note.title,
        latestVersion: note.getLatestVersion()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Get all notes for user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .select('title versions')
      .sort({ updatedAt: -1 });

    const formattedNotes = notes.map(note => ({
      id: note._id,
      title: note.title,
      versionCount: note.versions.length,
      latestVersion: note.getLatestVersion()
    }));

    res.json(formattedNotes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

// Get specific note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      id: note._id,
      title: note.title,
      versions: note.versions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
};

// Update note (creates new version)
const updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.addVersion(content);
    res.json({
      message: 'Note updated successfully',
      note: {
        id: note._id,
        title: note.title,
        latestVersion: note.getLatestVersion()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

// Get specific version
const getVersion = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const version = note.getVersion(parseInt(req.params.version));
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    res.json({
      id: note._id,
      title: note.title,
      version
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching version', error: error.message });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  getVersion,
  deleteNote
}; 