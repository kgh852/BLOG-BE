const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRoom = async (req, res) => {
    const { name, userIds } = req.body; 
    try {
        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: "userIds는 배열이어야 합니다." });
        }

        const chatRoom = await prisma.chatRoom.create({
            data: {
                name,
                users: {
                    connect: userIds.map(id => ({ id })),
                },
            },
        });

        res.status(201).json(chatRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "채팅방 생성 중 오류가 발생했습니다." });
    }
};

const sendMessage = async (req, res) => {
    const { content, roomId } = req.body;
    const senderId = req.user.id;

    try {
        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId }
        });

        if (!room) {
            return res.status(404).json({ message: '존재하지 않는 채팅방입니다.' });
        }

        const message = await prisma.message.create({
            data: {
                content,
                roomId,
                senderId,
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메시지 생성 중 오류가 발생했습니다.' });
    }
};

const getMessages = async (req, res) => {
    const { roomId } = req.params;

    try {
        const messages = await prisma.message.findMany({
            where: { roomId: parseInt(roomId, 10) },
            include: { sender: true },
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '메시지 조회 중 오류가 발생했습니다.' });
    }
};

module.exports = { createRoom, sendMessage, getMessages };
