const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const roomStore = new Map();

const ensureRoom = (roomId) => {
    if (!roomStore.has(roomId)) {
        roomStore.set(roomId, {
            offer: null,
            answer: null,
            hostCandidates: [],
            guestCandidates: [],
            chat: [],
            states: {},
            updatedAt: Date.now(),
        });
    }
    return roomStore.get(roomId);
};

router.post('/:roomId/offer', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    room.offer = req.body.offer || null;
    room.updatedAt = Date.now();
    res.json({ success: true });
});

router.get('/:roomId/offer', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    res.json({ offer: room.offer });
});

router.post('/:roomId/answer', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    room.answer = req.body.answer || null;
    room.updatedAt = Date.now();
    res.json({ success: true });
});

router.get('/:roomId/answer', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    res.json({ answer: room.answer });
});

router.post('/:roomId/candidate', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    const role = req.body.role === 'host' ? 'host' : 'guest';
    const candidate = req.body.candidate;

    if (candidate) {
        if (role === 'host') room.hostCandidates.push(candidate);
        else room.guestCandidates.push(candidate);
    }

    room.updatedAt = Date.now();
    res.json({ success: true });
});

router.get('/:roomId/candidates', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    const role = req.query.role === 'host' ? 'host' : 'guest';
    const after = Math.max(0, parseInt(req.query.after || '0', 10));

    const source = role === 'host' ? room.guestCandidates : room.hostCandidates;
    const candidates = source.slice(after);

    res.json({
        candidates,
        nextCursor: after + candidates.length,
    });
});

router.post('/:roomId/chat', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Message is required' });

    room.chat.push({
        userId: req.user.id,
        name: req.user.email || `User ${req.user.id}`,
        role: req.body.role === 'host' ? 'host' : 'guest',
        text: text.slice(0, 500),
        ts: Date.now(),
    });
    room.updatedAt = Date.now();
    res.json({ success: true });
});

router.get('/:roomId/chat', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    const after = Math.max(0, parseInt(req.query.after || '0', 10));
    const messages = room.chat.slice(after);
    res.json({ messages, nextCursor: after + messages.length });
});

router.post('/:roomId/state', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    const role = req.body.role === 'host' ? 'host' : 'guest';
    const key = `${role}-${req.user.id}`;
    room.states[key] = {
        role,
        userId: req.user.id,
        micEnabled: Boolean(req.body.micEnabled),
        camEnabled: Boolean(req.body.camEnabled),
        handRaised: Boolean(req.body.handRaised),
        sharingScreen: Boolean(req.body.sharingScreen),
        reaction: typeof req.body.reaction === 'string' ? req.body.reaction.slice(0, 16) : '',
        ts: Date.now(),
    };
    room.updatedAt = Date.now();
    res.json({ success: true });
});

router.get('/:roomId/state', authenticateToken, (req, res) => {
    const room = ensureRoom(req.params.roomId);
    const states = Object.values(room.states).sort((a, b) => b.ts - a.ts);
    res.json({ states });
});

module.exports = router;
