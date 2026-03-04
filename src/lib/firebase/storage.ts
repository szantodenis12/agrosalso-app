'use client';
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';

/**
 * Încarcă un fișier în Firebase Storage și returnează URL-ul public.
 */
export async function uploadImage(
  storage: FirebaseStorage, 
  file: File, 
  folder: string = 'products'
): Promise<string> {
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const storageRef = ref(storage, `${folder}/${filename}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
