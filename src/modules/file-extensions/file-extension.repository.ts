import prisma from '../../lib/db';
import { FileExtension } from '@/src/prisma/generated/prisma';
import { FileExtensionDto } from '@/src/modules/file-extensions/dto/file-extension.dto';

const DEFAULT_EXTENSIONS = ['bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'];

/**
 * FileExtension 모델에 대한 데이터 접근(CRUD)을 담당하는 레포지토리 객체입니다.
 */

export const FileExtensionRepository = {
    /**
     * 이름으로 특정 확장자 레코드를 찾습니다.
     * @param name 확장자 이름 (조회 전 소문자로 변환)
     */
    findByName: async (name: string): Promise<FileExtensionDto | null> => {
        return prisma.fileExtension.findUnique({
            where: {
                // 💡 DB에서 대소문자를 구분하지 않도록, 조회 전 소문자로 변환합니다.
                name: name.toLowerCase(),
            },
            select: {
                name: true,
                isAllowed: true,
            },
        });
    },

    findByDefault: async (): Promise<FileExtensionDto[] | null> => {
        return prisma.fileExtension.findMany({
            where: {
                name: {
                    in: DEFAULT_EXTENSIONS,
                },
            },
            select: {
                name: true,
                isAllowed: true,
            },
        });
    },
    findByInput: async (): Promise<FileExtensionDto[]> => {
        return prisma.fileExtension.findMany({
            where: {
                name: {
                    notIn: DEFAULT_EXTENSIONS,
                },
            },
            select: {
                name: true,
                isAllowed: true,
            },
            orderBy: { id: 'asc' }, // 정렬 기준 추가
        }); 
    },  

    /**
     * 허용 상태(isAllowed)에 따라 여러 확장자 레코드를 찾습니다.
     */
    findManyByAllowed: async (
        isAllowed: boolean
    ): Promise<FileExtensionDto[]> => {
        return prisma.fileExtension.findMany({
            where: {
                isAllowed: isAllowed,
            },
            select: {
                name: true,
                isAllowed: true,
            },
            orderBy: { id: 'asc' }, // 정렬 기준 추가
        });
    },

    // ====================================================================
    // CREATE / UPDATE (Upsert를 사용하여 '체크할 때마다 DB 반영' 구현)
    // ====================================================================

    /**
     * 확장자 레코드를 생성하거나(없으면) 업데이트합니다(있으면).
     * 이 함수는 '체크할 때마다 DB에 반영'하는 요구사항을 가장 잘 충족시킵니다.
     */
    updateExtension: async (
        extensionName: string,
        isAllowed: boolean
    ): Promise<void> => {
        const lowerCaseName = extensionName.toLowerCase();
        if (!DEFAULT_EXTENSIONS.includes(extensionName)) {
            throw new Error('This extension cannot be modified.');
        }

        await prisma.fileExtension.update({
            where: { name: lowerCaseName },
            data: { isAllowed: isAllowed },
        });
    },

    // ====================================================================
    // COUNT / DELETE
    // ====================================================================

    /**
     * 전체 확장자 레코드의 개수를 반환합니다.
     */
    count: async (): Promise<number> => {
        return prisma.fileExtension.count({});
    },

    /**
     * 제외 목록에 없는, '비허용' 상태의 확장자를 일괄 삭제합니다. (관리자 기능)
     */
    deleteRemovableExtensions: async (): Promise<void> => {
        prisma.fileExtension.deleteMany({
            where: {
                isAllowed: false,
                name: {
                    notIn: DEFAULT_EXTENSIONS, // 💡 제외 목록 사용
                },
            },
        });
    },
    deleteUnused: async (extensions: string[]): Promise<void> => {
        await prisma.fileExtension.deleteMany({
            where: {
                AND: [
                    {
                        // 프론트에서 보낸 리스트에 없어야 함
                        name: { notIn: extensions.map((ext) => ext.toLowerCase()) },
                    },
                    {
                        // 동시에 기본 확장자 리스트에도 없어야 함
                        name: { notIn: DEFAULT_EXTENSIONS },
                    },
                ],
            },
        });
    },
    createMany: async (extensions: string[]): Promise<void> => {
        await prisma.fileExtension.createMany({
            data: extensions.map((ext) => ({
                name: ext.toLowerCase(),
                isAllowed: true, // 기본값 설정
            })),
            skipDuplicates: true, // 중복된 이름은 건너뜁니다.
        });
    },
};

// 기본 내보내기
export default FileExtensionRepository;
