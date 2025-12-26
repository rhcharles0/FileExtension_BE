import { FileExtensionService } from '@/src/modules/file-extensions/fileExtension.service';
import { NextRequest } from 'next/server';


export async function PATCH(request: NextRequest) {
    let body;

    // 1. 요청 바디 파싱 및 JSON 유효성 검사
    try {
        body = await request.json();
        console.info('Parsed body:', body);
    } catch (e) {
        // 💡 corsResponse 대신 표준 Response 사용
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const { name, isAllowed } = body;
    // 2. 필수 필드 및 타입 유효성 검사
    if (!name || typeof isAllowed !== 'boolean') {
        return new Response(
            JSON.stringify({
                error: `Missing or invalid fields: 'name' (string) and 'isAllowed' (boolean) are required.`,
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
    // 3. 서비스 로직 실행 (DB 업데이트)
    try {
        await FileExtensionService.updateExtension(name, isAllowed);
        console.info(`Extension ${name} updated to isAllowed=${isAllowed}`);
    } catch (error) {
        console.error('Extension update failed:', error);
        // 💡 서버 에러 발생 시 표준 Response 사용
        return new Response(
            JSON.stringify({ error: `Update failed for ${name}.` }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    // 4. 성공 응답 반환 (204 No Content)
    // PATCH 성공 시 본문 없이 204를 반환하는 것이 REST 표준입니다.

    return new Response(null, {
        status: 204,

    });
}

