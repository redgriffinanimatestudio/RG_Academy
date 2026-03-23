import fs from 'fs';
import path from 'path';

/**
 * Простой скрипт для статического анализа кодовой базы (SAST)
 */
function runAudit() {
    const rootDir = process.cwd();
    const findings = [];

    // 1. Поиск хардкодных секретов и токенов
    const scanFiles = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (!['node_modules', '.git', 'dist'].includes(file)) {
                    scanFiles(fullPath);
                }
            } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // Проверка на хардкод токены
                if (content.includes('DEV_TOKEN_SUPER_ADMIN')) {
                    findings.push({
                        file: fullPath,
                        issue: 'Хардкодный токен администратора!',
                        severity: 'CRITICAL'
                    });
                }

                // Проверка на небезопасный console.log в проде
                if (content.includes('console.log(')) {
                    findings.push({
                        file: fullPath,
                        issue: 'Использование console.log в коде (рекомендуется логгер)',
                        severity: 'LOW'
                    });
                }

                // Проверка на использование SQLite в проде
                if (file.endsWith('schema.prisma') && content.includes('provider = "sqlite"')) {
                    findings.push({
                        file: fullPath,
                        issue: 'Использование SQLite для базы данных',
                        severity: 'MEDIUM'
                    });
                }
            }
        });
    };

    scanFiles(rootDir);

    // 2. Оценка покрытия тестами (поиск файлов *.test.*)
    let testFilesCount = 0;
    const findTests = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (!['node_modules', '.git', 'dist'].includes(file)) {
                    findTests(fullPath);
                }
            } else if (file.includes('.test.') || file.includes('.spec.')) {
                testFilesCount++;
            }
        });
    };
    findTests(rootDir);

    if (testFilesCount === 0) {
        findings.push({
            file: 'N/A',
            issue: 'Полное отсутствие тестов в проекте!',
            severity: 'HIGH'
        });
    }

    // Вывод результатов
    console.log('--- РЕЗУЛЬТАТЫ АУДИТА ---');
    console.log(`Просканировано файлов: ${findings.length}`);
    console.log(`Найдено тестов: ${testFilesCount}`);
    console.log('\nНарушения:');
    findings.forEach(f => {
        console.log(`[${f.severity}] ${f.issue} - ${f.file}`);
    });

    // Сохранение отчета
    fs.writeFileSync('audit_results.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        findings,
        summary: {
            totalIssues: findings.length,
            criticalIssues: findings.filter(f => f.severity === 'CRITICAL').length,
            testCount: testFilesCount
        }
    }, null, 2));
}

runAudit();
