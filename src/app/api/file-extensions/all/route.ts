import { NextRequest, NextResponse } from 'next/server';

import { FileExtensionService as service } from '@/src/modules/file-extensions/fileExtension.service';

export async function GET(request: NextRequest) {
    const inputExtensions = await service.getAllByInput();
    const defaultExtensions = await service.getAllByDefault();
    if (!inputExtensions || !defaultExtensions) {
        return new Response(JSON.stringify({ result: `No extensions found` }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(
        JSON.stringify({ defaultExtensions, inputExtensions }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

export async function POST(request: NextRequest) {
    const extensions = await request.json();
    await service.syncExtensions(extensions);
    return NextResponse.json(
        {},
        {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
