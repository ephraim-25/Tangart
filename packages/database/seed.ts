import { PrismaClient, Role } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database for TangArt ...');

  // 1. Create Teachers
  const teacher1 = await prisma.user.create({
    data: { name: 'Ephraim Plams', email: 'ephraim@tangart.com', role: Role.TEACHER },
  });
  const teacher2 = await prisma.user.create({
    data: { name: 'Sarah DaVinci', email: 'sarah@tangart.com', role: Role.TEACHER },
  });
  const admin = await prisma.user.create({
    data: { name: 'Madame Plamedie', email: 'admin@tangart.com', role: Role.ADMIN },
  });

  // 2. Create Learners
  const learners = [];
  for (let i = 1; i <= 10; i++) {
    learners.push(
      await prisma.user.create({
        data: { name: `Student ${i}`, email: `student${i}@test.com`, role: Role.LEARNER },
      })
    );
  }

  // 3. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Maîtrise de la Perspective',
      description: 'Plongez dans les fondamentaux de la perspective 3D.',
      price: 150.0,
      teacher: { connect: { id: teacher1.id } },
      chapters: {
        create: [
          { title: 'Intro Perspective', order: 1 },
          { title: 'Point de fuite', order: 2 },
          { title: 'Lignes d\'horizon', order: 3 },
          { title: 'Exercice Pratique', order: 4 },
        ]
      }
    },
    include: { chapters: true }
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Peinture Digitale Avancée',
      description: 'L\'art du pinceau numérique sur tablette.',
      price: 200.0,
      teacher: { connect: { id: teacher2.id } },
      chapters: {
        create: [
          { title: 'Brush Settings', order: 1 },
          { title: 'Color Blending', order: 2 },
          { title: 'Masterpiece', order: 3 },
        ]
      }
    },
    include: { chapters: true }
  });

  // 4. Create Transactions & Progress (Simulate 50 transactions spread across learners)
  for (let i = 0; i < 50; i++) {
    const student = learners[i % 10];
    const course = i % 2 === 0 ? course1 : course2;
    
    // Simulate drop-off for Retention Analytics !
    // Random chance to stop at chapter 2 (high drop off)
    const rand = Math.random();
    let completedChaptersCount = 0;
    
    if (rand < 0.4) completedChaptersCount = 2; // high drop-off at chapter 2
    else if (rand < 0.7) completedChaptersCount = course.chapters.length; // completed course
    else completedChaptersCount = 1;

    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: student.id, courseId: course.id }
      }
    });

    if (!existingEnrollment) {
      await prisma.transaction.create({
        data: {
          flw_ref: `FLW_MOCK_${Math.random().toString(36).substring(7)}`,
          amount_gross: course.price,
          platform_fee_8: course.price * 0.08,
          teacher_net_92: course.price * 0.92,
          studentId: student.id,
          courseId: course.id,
          // Generate realistic past dates
          createdAt: new Date(Date.now() - Math.random() * 10000000000)
        }
      });

      const lastChapter = course.chapters[completedChaptersCount - 1] || course.chapters[0];

      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progressPercent: (completedChaptersCount / course.chapters.length) * 100,
          lastChapterId: lastChapter.id
        }
      });

      for (let j = 0; j < completedChaptersCount; j++) {
        await prisma.chapterProgress.create({
          data: {
            studentId: student.id,
            chapterId: course.chapters[j].id,
            isCompleted: true
          }
        });
      }
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
