
import { NextResponse } from 'next/server';
import type { Committee, User } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.committees) {
    global.committees = [];
}
if (!global.users) {
    global.users = [
        { id: 'USR001', name: 'Admin User', email: 'admin@unilifefest.com', role: 'Admin', password: 'unilifejaya123', phoneNumber: '081234567890' },
        { id: 'USR002', name: 'Panitia Event', email: 'panitia2025@unilife.com', role: 'Panitia', password: 'lampungfest123', phoneNumber: '080987654321' }
    ];
}

const getCommittees = (): Committee[] => {
    const committees = global.committees as Omit<Committee, 'user'>[];
    const users = global.users as User[];
    const userMap = new Map(users.map(u => [u.id, u]));
    
    return committees
        .map(committee => ({
            ...committee,
            user: userMap.get(committee.userId),
        }))
        .filter((c): c is Committee & { user: User } => !!c.user);
};

const saveCommitteesRaw = (committees: Omit<Committee, 'user'>[]) => {
    global.committees = committees;
};

const getCommitteesRaw = (): Omit<Committee, 'user'>[] => {
    return global.committees;
}

// GET /api/committee
export async function GET() {
    try {
        const committees = getCommittees();
        return NextResponse.json(committees);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching committees', error }, { status: 500 });
    }
}

// POST /api/committee
export async function POST(request: Request) {
    try {
        const committeeData: Omit<Committee, 'user'> = await request.json();
        const committees = getCommitteesRaw();
        
        let savedCommittee: Omit<Committee, 'user'>;
        let updatedCommittees;

        if (committeeData.id) { // Update
            updatedCommittees = committees.map(c => (c.id === committeeData.id ? committeeData : c));
            savedCommittee = committeeData;
        } else { // Create
            savedCommittee = { ...committeeData, id: `CMT${Date.now()}` };
            updatedCommittees = [...committees, savedCommittee];
        }

        saveCommitteesRaw(updatedCommittees);
        return NextResponse.json({ message: 'Committee member saved successfully', committee: savedCommittee }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving committee member', error }, { status: 500 });
    }
}
