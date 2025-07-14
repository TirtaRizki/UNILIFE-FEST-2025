
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Committee, User } from '@/lib/types';


// GET /api/committee
export async function GET() {
    try {
        const data = db.read();
        const committees = data.committees;
        const users = data.users;
        const userMap = new Map(users.map(u => [u.id, u]));
        
        const populatedCommittees = committees
            .map(committee => ({
                ...committee,
                user: userMap.get(committee.userId),
            }))
            .filter((c): c is Committee & { user: User } => !!c.user);

        return NextResponse.json(populatedCommittees);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching committees', error }, { status: 500 });
    }
}

// POST /api/committee
export async function POST(request: Request) {
    try {
        const committeeData: Omit<Committee, 'user'> = await request.json();
        const data = db.read();
        let savedCommittee: Omit<Committee, 'user'>;

        if (committeeData.id) { // Update
            const index = data.committees.findIndex(c => c.id === committeeData.id);
            if (index !== -1) {
                data.committees[index] = committeeData;
                savedCommittee = committeeData;
            } else {
                 return NextResponse.json({ message: 'Committee member not found' }, { status: 404 });
            }
        } else { // Create
            savedCommittee = { ...committeeData, id: `CMT${Date.now()}` };
            data.committees.push(savedCommittee);
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Committee member saved successfully', committee: savedCommittee }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving committee member', error }, { status: 500 });
    }
}
