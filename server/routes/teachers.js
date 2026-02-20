const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { fromUSD, normalizeCurrency } = require('../utils/currency');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const getPreferredCurrency = async (req) => {
    const fromQuery = req.query.currency;
    if (fromQuery) return normalizeCurrency(fromQuery);

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return 'USD';

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const viewer = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { preferred_currency: true },
        });
        return normalizeCurrency(viewer?.preferred_currency || 'USD');
    } catch (_) {
        return 'USD';
    }
};

// Get all teachers with filtering
router.get('/', async (req, res) => {
    const { subject, grade, search, state } = req.query;
    const preferredCurrency = await getPreferredCurrency(req);

    const whereClause = {
        role: 'teacher',
        teacherProfile: {
            isNot: null,
        }
    };

    if (subject || grade) {
        whereClause.teacherProfile.subjects = {
            some: {
                subject: {
                    AND: [
                        subject ? { name: { contains: subject } } : {},
                        grade ? { grade_level: grade } : {}
                    ]
                }
            }
        };
    }

    if (search) {
        whereClause.AND = [
            {
                OR: [
                    { name: { contains: search } },
                    { teacherProfile: { bio: { contains: search } } }
                ]
            }
        ];
    }

    if (state) {
        whereClause.teacherProfile = {
            ...whereClause.teacherProfile,
            state_alignment: {
                contains: state
            }
        };
    }

    try {
        const teachers = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                avatar_url: true,
                teacherProfile: {
                    select: {
                        id: true,
                        headline: true,
                        bio: true,
                        hourly_rate: true,
                        hourly_rate_local: true,
                        hourly_rate_currency: true,
                        state_alignment: true,
                        years_experience: true,
                        availability: true,
                        subjects: {
                            select: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });
        const converted = teachers.map((teacher) => {
            const usdRate = Number(teacher.teacherProfile?.hourly_rate || 0);
            return {
                ...teacher,
                teacherProfile: {
                    ...teacher.teacherProfile,
                    hourly_rate_display: fromUSD(usdRate, preferredCurrency),
                    hourly_rate_display_currency: preferredCurrency,
                },
            };
        });
        res.json(converted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});

// Get single teacher profile
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const preferredCurrency = await getPreferredCurrency(req);
    try {
        const teacher = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                avatar_url: true,
                teacherProfile: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        },
                        bookings: {
                            select: {
                                review: true
                            }
                        }
                    }
                }
            }
        });

        if (!teacher || !teacher.teacherProfile) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const usdRate = Number(teacher.teacherProfile?.hourly_rate || 0);
        res.json({
            ...teacher,
            teacherProfile: {
                ...teacher.teacherProfile,
                hourly_rate_display: fromUSD(usdRate, preferredCurrency),
                hourly_rate_display_currency: preferredCurrency,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch teacher profile' });
    }
});

module.exports = router;
