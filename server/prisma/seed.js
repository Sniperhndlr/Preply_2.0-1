const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Subjects
    const math = await prisma.subject.upsert({
        where: { name: 'Algebra I' },
        update: {},
        create: { name: 'Algebra I', category: 'Math', grade_level: '9' },
    });
    const reading = await prisma.subject.upsert({
        where: { name: 'American Literature' },
        update: {},
        create: { name: 'American Literature', category: 'Reading', grade_level: '10' },
    });

    // Create Teacher
    const teacherUser = await prisma.user.upsert({
        where: { email: 'teacher@test.com' },
        update: {},
        create: {
            email: 'teacher@test.com',
            password_hash: hashedPassword,
            role: 'teacher',
            name: 'Mr. Smith',
            balance_minutes: 120,
            credits_usd: 25,
            preferred_currency: 'USD',
            teacherProfile: {
                create: {
                    headline: 'US Math Tutor | NY & NJ standards',
                    bio: 'Experienced Math teacher with 10 years at public high schools.',
                    hourly_rate: 40.0,
                    hourly_rate_local: 40.0,
                    hourly_rate_currency: 'USD',
                    state_alignment: 'NY, NJ',
                    years_experience: 10,
                    education: 'M.Ed. in Secondary Mathematics',
                    certifications: 'New York State Teaching Certificate',
                    timezone: 'America/New_York',
                    is_profile_complete: true,
                    availability: JSON.stringify({
                        monday: ['16:00', '17:00', '18:00'],
                        wednesday: ['16:00', '17:00'],
                    }),
                    subjects: {
                        create: { subjectId: math.id },
                    },
                },
            },
        },
    });

    // Create Student
    const studentUser = await prisma.user.upsert({
        where: { email: 'student@test.com' },
        update: {},
        create: {
            email: 'student@test.com',
            password_hash: hashedPassword,
            role: 'student',
            name: 'Jane Doe',
            balance_minutes: 180,
            credits_usd: 50,
            preferred_currency: 'USD',
        },
    });

    console.log({ teacherUser, studentUser });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
