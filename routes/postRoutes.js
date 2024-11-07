const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware')
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
} = require('../controllers/postController'); 

router.post('/', authenticateToken, createPost); 
router.get('/', getPosts); 
router.get('/:id', getPostById); 
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;
