
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'File tidak ditemukan.' }, { status: 400 });
        }

        // getAdminDb() now returns the initialized app instance
        const adminApp = getAdminDb(); 
        if (!adminApp) {
             throw new Error("Firebase Admin SDK is not initialized.");
        }
        
        // Get the default bucket from the initialized admin app
        const bucket = adminApp.storage().bucket();
        if (!bucket.name) {
             throw new Error("Firebase Storage bucket name is not configured in environment variables or admin initialization.");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `logos/${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
        const fileUpload = bucket.file(filename);

        await fileUpload.save(buffer, {
            metadata: {
                contentType: file.type,
            },
            public: true, // Make the file publicly readable
        });

        // Construct the public URL manually
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;

        return NextResponse.json({ message: 'File berhasil diunggah', url }, { status: 200 });

    } catch (error) {
        console.error('Error uploading file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan di server.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
