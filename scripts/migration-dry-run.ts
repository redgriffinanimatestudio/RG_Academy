import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Имитация экспорта из Firestore (Mocks)
const mockFirestoreUsers = [
  {
    id: 'fs_user_1',
    email: 'student@example.com',
    displayName: 'Ivan Ivanov',
    roles: ['student'],
    createdAt: { _seconds: 1711497600, _nanoseconds: 0 } // Firebase format
  },
  {
    id: 'fs_user_2',
    email: 'mentor@example.com',
    displayName: 'Elena Vance',
    roles: ['lecturer', 'executor'],
    createdAt: { _seconds: 1711501200, _nanoseconds: 0 }
  }
];

const mockFirestoreCourses = [
  {
    id: 'fs_course_1',
    slug: 'maya-rigging-pro',
    title: 'Maya Rigging Pro',
    description: 'Advanced rigging course',
    price: 99.99,
    lecturerId: 'fs_user_2', // Ссылка на Firestore ID
    categoryId: 'cmn87obws000vf02k0k8r1rgo', // Существующая категория в нашей БД
    tags: ['maya', 'rigging'],
    status: 'published'
  }
];

// 2. Функции трансформации (Transform Logic)
function transformFirestoreDate(fsDate: any): Date {
  if (fsDate && fsDate._seconds) {
    return new Date(fsDate._seconds * 1000);
  }
  return new Date();
}

async function runDryRun() {
  console.log('🚀 Starting Migration Dry Run...');
  let successCount = 0;
  let errorCount = 0;

  try {
    // Используем транзакцию, которую в конце откатим, чтобы не мусорить в базе
    await prisma.$transaction(async (tx) => {
      
      console.log('\n--- Phase 1: Users Transformation ---');
      for (const fsUser of mockFirestoreUsers) {
        try {
          const transformedUser = {
            id: fsUser.id, // Сохраняем оригинальный ID для связей
            email: fsUser.email,
            displayName: fsUser.displayName,
            role: fsUser.roles[0],
            primaryRole: fsUser.roles[0],
            roles: JSON.stringify(fsUser.roles),
            isStudent: fsUser.roles.includes('student'),
            isLecturer: fsUser.roles.includes('lecturer'),
            isExecutor: fsUser.roles.includes('executor'),
            source: 'migration_firestore',
            createdAt: transformFirestoreDate(fsUser.createdAt),
            updatedAt: new Date()
          };

          // Проверка валидности через Upsert (но только в памяти транзакции)
          await tx.user.upsert({
            where: { email: fsUser.email },
            update: transformedUser,
            create: transformedUser
          });
          
          console.log(`✅ Validated User: ${fsUser.email}`);
          successCount++;
        } catch (e: any) {
          console.error(`❌ User Validation Failed: ${fsUser.email}`, e.message);
          errorCount++;
        }
      }

      console.log('\n--- Phase 2: Courses Transformation ---');
      for (const fsCourse of mockFirestoreCourses) {
        try {
          // Ищем лектора по его Firestore ID
          const lecturer = await tx.user.findUnique({ where: { id: fsCourse.lecturerId } });
          if (!lecturer) throw new Error(`Lecturer ${fsCourse.lecturerId} not found in migrated users`);

          const transformedCourse = {
            slug: fsCourse.slug,
            title: fsCourse.title,
            description: fsCourse.description,
            price: fsCourse.price,
            lecturerId: fsCourse.lecturerId,
            lecturerName: lecturer.displayName || 'Unknown',
            categoryId: fsCourse.categoryId,
            tags: JSON.stringify(fsCourse.tags),
            status: fsCourse.status,
            thumbnail: 'https://placeholder.com/course.jpg',
            level: 'intermediate'
          };

          await tx.course.upsert({
            where: { slug: fsCourse.slug },
            update: transformedCourse,
            create: { ...transformedCourse, id: fsCourse.id }
          });

          console.log(`✅ Validated Course: ${fsCourse.slug}`);
          successCount++;
        } catch (e: any) {
          console.error(`❌ Course Validation Failed: ${fsCourse.slug}`, e.message);
          errorCount++;
        }
      }

      console.log('\n--- Dry Run Results ---');
      console.log(`Total Success: ${successCount}`);
      console.log(`Total Errors: ${errorCount}`);

      // КРИТИЧЕСКИЙ МОМЕНТ: Бросаем ошибку, чтобы откатить все изменения
      throw new Error('ROLLBACK_INTENDED: This was a dry run. No data was committed.');
    });
  } catch (e: any) {
    if (e.message === 'ROLLBACK_INTENDED: This was a dry run. No data was committed.') {
      console.log('\n✨ Dry Run Finished Successfully (All changes rolled back).');
    } else {
      console.error('\n💥 Dry Run Crashed with unexpected error:', e);
    }
  }
}

runDryRun()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
