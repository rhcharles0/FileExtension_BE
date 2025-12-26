import prisma from '@/src/lib/db';

// 💡 초기에 데이터베이스에 삽입할 확장자 목록
const initialExtensions = [
    { name: 'bat', isAllowed: false },
    { name: 'cmd', isAllowed: false },
    { name: 'com', isAllowed: false },
    { name: 'cpl', isAllowed: false },
    { name: 'exe', isAllowed: false },
    { name: 'scr', isAllowed: false },
    { name: 'js', isAllowed: false },
];

// 이전에 설정한 강제 소문자 변환 로직을 고려하여,
// 시드 데이터도 저장 시 소문자로 통일되도록 합니다.
async function main() {
    console.log('🌱 Start seeding FileExtensions...');

    // ----------------------------------------------------
    //  FileExtension 시드 데이터 생성
    // ----------------------------------------------------
    for (const ext of initialExtensions) {
        // 💡 1. 확장자 이름을 소문자로 강제 변환
        const lowerCaseName = ext.name.toLowerCase();

        // 💡 2. upsert를 사용하여 중복 방지 (이미 있으면 업데이트, 없으면 생성)
        const fileExtension = await prisma.fileExtension.upsert({
            where: { name: lowerCaseName }, // name 필드가 @unique여야 upsert가 작동합니다.
            update: {
                // 이미 존재하는 경우, isAllowed 값만 업데이트 (또는 빈 객체 {})
                isAllowed: ext.isAllowed,
            },
            create: {
                name: lowerCaseName,
                isAllowed: ext.isAllowed,
            },
        });

        console.log(
            `✅ Upserted extension: ${fileExtension.name} (Allowed: ${fileExtension.isAllowed})`
        );
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('✅ FileExtension seeding finished.');
    });
