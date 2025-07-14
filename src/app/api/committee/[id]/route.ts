
import { NextResponse } from 'next/server';
import type { Committee } from '@/lib/types';

const getCommitteesRaw = (): Omit<Committee, 'user'>[] => {
    if (!global.committees) {
        global.committees = [];
    }
    return global.committees;
};

const saveCommitteesRaw = (committees: Omit<Committee, 'user'>[]) => {
    global.committees = committees;
};

// DELETE /api/committee/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let committees = getCommitteesRaw();
        const initialLength = committees.length;
        
        committees = committees.filter(c => c.id !== id);

        if (committees.length === initialLength) {
             return NextResponse.json({ message: 'Committee member not found' }, { status: 404 });
        }

        saveCommitteesRaw(committees);
        return NextResponse.json({ message: 'Committee member deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting committee member', error }, { status: 500 });
    }
}
