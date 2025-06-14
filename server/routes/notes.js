const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  getVersion,
  deleteNote
} = require('../controllers/noteController');

// All routes are protected with auth middleware
router.use(auth);

// Note routes
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Version routes
router.get('/:id/versions', getNote);
router.get('/:id/versions/:version', getVersion); 

module.exports = router; 