const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: { user: true },
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시글 목록을 가져오는 중 오류가 발생했습니다.' });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id, 10) },
            include: { user: true },
        });
        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시글 조회 중 오류가 발생했습니다.' });
    }
};

const createPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                userId
            }
        });
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시글 생성 중 오류가 발생했습니다.' });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id, 10) }
        });

        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ error: '게시글을 수정할 권한이 없습니다.' });
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id, 10) },
            data: { title, content }
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시글 수정 중 오류가 발생했습니다.' });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id, 10) }
        });

        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ error: '게시글을 삭제할 권한이 없습니다.' });
        }

        await prisma.post.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '게시글 삭제 중 오류가 발생했습니다.' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};
