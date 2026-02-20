const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');
const { normalizeCurrency, toUSD } = require('../utils/currency');

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

const teacherOnly = (req, res, next) => {
    if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Teacher access required' });
    next();
};

router.get('/profile', authenticateToken, teacherOnly, async (req, res) => {
    try {
        const profile = await prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                subjects: {
                    include: {
                        subject: true,
                    },
                },
            },
        });

        if (!profile) return res.status(404).json({ error: 'Teacher profile not found' });

        const subjectCatalog = await prisma.subject.findMany({ orderBy: { name: 'asc' } });

        res.json({ profile, subjectCatalog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tutor profile' });
    }
});

router.put('/profile', authenticateToken, teacherOnly, async (req, res) => {
    const {
        headline,
        bio,
        video_url,
        intro_video_url,
        hourly_rate,
        hourly_rate_currency,
        zoom_link,
        state_alignment,
        years_experience,
        education,
        certifications,
        timezone,
        availability,
        subjectIds,
    } = req.body;

    try {
        const teacherProfile = await prisma.teacherProfile.findUnique({ where: { userId: req.user.id } });
        if (!teacherProfile) return res.status(404).json({ error: 'Teacher profile not found' });

        const normalizedSubjectIds = Array.isArray(subjectIds)
            ? subjectIds.map((id) => parseInt(id, 10)).filter((id) => Number.isInteger(id))
            : [];
        const rateCurrency = normalizeCurrency(hourly_rate_currency);
        const localRate = hourly_rate ? parseFloat(hourly_rate) : null;
        const usdRate = localRate ? toUSD(localRate, rateCurrency) : null;

        await prisma.$transaction(async (tx) => {
            await tx.teacherProfile.update({
                where: { userId: req.user.id },
                data: {
                    headline: headline || null,
                    bio: bio || null,
                    video_url: video_url || null,
                    intro_video_url: intro_video_url || null,
                    hourly_rate: usdRate,
                    hourly_rate_local: localRate,
                    hourly_rate_currency: rateCurrency,
                    zoom_link: zoom_link || null,
                    state_alignment: state_alignment || null,
                    years_experience: years_experience ? parseInt(years_experience, 10) : null,
                    education: education || null,
                    certifications: certifications || null,
                    timezone: timezone || null,
                    availability: availability ? JSON.stringify(availability) : null,
                    is_profile_complete: Boolean(
                        headline && bio && hourly_rate && state_alignment && normalizedSubjectIds.length > 0,
                    ),
                },
            });

            if (Array.isArray(subjectIds)) {
                await tx.teacherSubject.deleteMany({ where: { teacherId: teacherProfile.id } });
            }
            if (normalizedSubjectIds.length > 0) {
                await tx.teacherSubject.createMany({
                    data: normalizedSubjectIds.map((subjectId) => ({
                        teacherId: teacherProfile.id,
                        subjectId,
                    })),
                });
            }
        });

        const updated = await prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                subjects: {
                    include: {
                        subject: true,
                    },
                },
            },
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to update tutor profile: ${error.message}` });
    }
});

router.get('/stats', authenticateToken, teacherOnly, async (req, res) => {
    try {
        const profile = await prisma.teacherProfile.findUnique({ where: { userId: req.user.id } });
        if (!profile) return res.status(404).json({ error: 'Teacher profile not found' });

        const bookings = await prisma.booking.findMany({
            where: { teacherId: profile.id },
            select: { status: true, startTime: true },
        });

        const totalLessons = bookings.length;
        const confirmedLessons = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;
        const upcomingLessons = bookings.filter((b) => new Date(b.startTime) > new Date() && b.status !== 'cancelled').length;

        res.json({ totalLessons, confirmedLessons, upcomingLessons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tutor stats' });
    }
});

module.exports = router;
