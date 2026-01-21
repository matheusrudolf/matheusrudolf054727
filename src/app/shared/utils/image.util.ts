export class ImageUtil {

    public convertToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    public base64ToFile(base64String: string, filename: string): File {
        try {
            let base64Data = base64String;
            let mimeType = 'image/jpeg';

            if (base64String.includes(',')) {
                const parts = base64String.split(',');
                base64Data = parts[1];

                const mimeMatch = parts[0].match(/:(.*?);/);
                if (mimeMatch) mimeType = mimeMatch[1];
            }

            const byteString = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], { type: mimeType });
            const file = new File([blob], filename, { type: mimeType, lastModified: Date.now() });

            return file;

        } catch (error) {
            console.error('Erro ao converter base64 para file:', error);
            throw error;
        }
    }
}
