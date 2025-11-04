// app/actions/convertWithConvertAPI.js
"use server";

export async function convertFileWithConvertAPI(
  outputFormat: string,
  uploadedFile: File | null
) {
  if (!uploadedFile) {
    return { error: "No file provided." };
  }

  const apiKey = process.env.CONVERTAPI_SECRET;
  if (!apiKey) {
    return { error: "Missing CONVERTAPI_SECRET environment variable." };
  }

  try {
    const formData = new FormData();
    formData.append('File', uploadedFile);
    formData.append('StoreFile', 'true');

    // مپ کردن فرمت‌ها
    const formatMap: Record<string, string> = {
      'pdf': 'pdf',
      'doc': 'doc',
      'docx': 'docx', 
      'jpg': 'jpg',
      'jpeg': 'jpg',
      'png': 'png',
      'gif': 'gif',
      'txt': 'txt',
      'html': 'html'
    };

    const inputExt = uploadedFile.name.split('.').pop()?.toLowerCase() || 'pdf';
    const outputFormatMapped = formatMap[outputFormat] || outputFormat;

    const response = await fetch(
      `https://v2.convertapi.com/convert/${inputExt}/to/${outputFormatMapped}?Secret=${apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Conversion failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.Files && result.Files[0]) {
      return { 
        success: true, 
        downloadURL: result.Files[0].Url,
        fileSize: result.Files[0].FileSize
      };
    } else {
      throw new Error("No converted file found in response");
    }

  } catch (error) {
    console.error("Error converting file:", error);
    return {
      error: (error as Error).message || "Failed to convert file.",
    };
  }
}