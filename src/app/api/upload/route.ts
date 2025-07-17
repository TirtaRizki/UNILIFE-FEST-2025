
import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  console.log('📨 /api/upload route called');
  try {
    // The call to adminStorage() will trigger initialization if it hasn't happened yet.
    const bucket = adminStorage().bucket();
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('❌ No file in request');
      return NextResponse.json({ message: 'File tidak ditemukan.' }, { status: 400 });
    }
    
    console.log('📨 Received file:', file?.name);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${uuidv4()}-${file.name}`;
    const filePath = `logos/${uniqueFilename}`;
    
    const fileUpload = bucket.file(filePath);

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make the file publicly readable
    await fileUpload.makePublic();
    
    // Get the public URL
    const publicUrl = fileUpload.publicUrl();

    console.log('✅ File uploaded successfully:', publicUrl);
    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (error) {
    console.error("❌ API Error in /api/upload:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Gagal mengunggah file: ${errorMessage}` }, { status: 500 });
  }
}
