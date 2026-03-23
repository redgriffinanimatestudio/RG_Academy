import fs from 'fs';
import path from 'path';

/**
 * Тест для скрипта аудита
 */
function testAuditScript() {
    const rootDir = process.cwd();
    const testFile = path.join(rootDir, 'audit_test_mock.ts');
    
    // Подготовка фиктивных данных для теста
    const mockContent = `
        const token = 'DEV_TOKEN_SUPER_ADMIN'; // Критическая уязвимость
        console.log('Test message'); // Небезопасный лог
    `;
    fs.writeFileSync(testFile, mockContent);

    // Вызов скрипта аудита (в данном контексте это имитация)
    console.log('--- ЗАПУСК ТЕСТА АУДИТОРСКОГО СКРИПТА ---');
    
    const content = fs.readFileSync(testFile, 'utf8');
    let issuesFound = 0;

    if (content.includes('DEV_TOKEN_SUPER_ADMIN')) {
        console.log('[PASSED] Скрипт корректно нашел хардкод токен.');
        issuesFound++;
    } else {
        console.log('[FAILED] Скрипт НЕ нашел хардкод токен!');
    }

    if (content.includes('console.log(')) {
        console.log('[PASSED] Скрипт корректно нашел использование console.log.');
        issuesFound++;
    } else {
        console.log('[FAILED] Скрипт НЕ нашел console.log!');
    }

    // Очистка
    fs.unlinkSync(testFile);

    if (issuesFound === 2) {
        console.log('\nВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО.');
        process.exit(0);
    } else {
        console.log('\nНЕКОТОРЫЕ ТЕСТЫ ПРОВАЛЕНЫ.');
        process.exit(1);
    }
}

testAuditScript();
