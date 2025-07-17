
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'File tidak ditemukan.' }, { status: 400 });
        }

        // Initialize Firebase Admin Storage
        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!bucketName) {
            throw new Error("Firebase Storage bucket name is not configured in environment variables.");
        }
        const bucket = getAdminDb().storage().bucket(bucketName);

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `logos/${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
        const fileUpload = bucket.file(filename);

        await fileUpload.save(buffer, {
            metadata: {
                contentType: file.type,
            },
        });

        // Get public URL
        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // A very long time in the future
        });

        return NextResponse.json({ message: 'File berhasil diunggah', url }, { status: 200 });

    } catch (error) {
        console.error('Error uploading file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan di server.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
