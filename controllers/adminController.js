const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, role: true },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: '사용자 조회 중 오류가 발생했습니다.' });
    }
};

const deleteUserByAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id, 10) } });
        res.status(200).json({ message: '사용자가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '사용자 삭제 중 오류가 발생했습니다.' });
    }
};

const deletePostByAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({ where: { id: parseInt(id, 10) } });
        res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '게시글 삭제 중 오류가 발생했습니다.' });
    }
};

module.exports = {
    getAllUsers,
    deleteUserByAdmin,
    deletePostByAdmin,
};
