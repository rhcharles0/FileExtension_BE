import { FileExtensionRepository as repo } from '@/src/modules/file-extensions/file-extension.repository';
import { FileExtensionDto } from '@/src/modules/file-extensions/dto/file-extension.dto';
import prisma from '@/src/lib/db';
import { error } from 'console';
export const FileExtensionService = {
    /**
     * 이름으로 특정 확장자 레코드를 찾습니다.
     * @param name 확장자 이름
     */
    getByName: async (name: string): Promise<FileExtensionDto | null> => {
        return repo.findByName(name);
    },

    getAllByDefault: async (): Promise<FileExtensionDto[] | null> => {
        return repo.findByDefault();
    },
    getAllByInput: async (): Promise<FileExtensionDto[]> => {
        return repo.findByInput();
    },
    /**
     * 허용 상태(isAllowed)에 따라 여러 확장자 레코드를 찾습니다.
     */
    getByAllowedStatus: async (
        isAllowed: boolean
    ): Promise<FileExtensionDto[]> => {
        return repo.findManyByAllowed(isAllowed);
    },

    /**
     * 확장자 레코드의 허용 상태(isAllowed)를 업데이트합니다.
     */
    updateExtension: async (
        extensionName: string,
        isAllowed: boolean
    ): Promise<void> => {
        repo.updateExtension(extensionName, isAllowed);
    },
    /**
     * 여러 확장자 레코드를 한 번에 생성합니다.
     */
    syncExtensions: async (extensions: string[]) => {
        await prisma.$transaction(async (tx) => {
            // 1. 삭제 (Delete)
            // DB에는 있지만 extensions 리스트에는 없는 데이터들 중,
            // 고정된 항목(isFixed: true)이 아닌 것만 골라 삭제합니다.
            await repo.deleteUnused(extensions);
            await repo.createMany(extensions);
            const total = await repo.count();
            if (total >= 205) {
                // 예: 200개 제한
                // 에러를 던지면 이 트랜잭션 전체가 Rollback(취소)됩니다.
                throw new Error(
                    `최대 저장 가능 개수를 초과했습니다. (현재: ${total}개)`
                );
            }
        });
    },

    /**
     * 전체 확장자 레코드의 개수를 반환합니다.
     */
    getCount: async (): Promise<number> => {
        return repo.count();
    },
};
