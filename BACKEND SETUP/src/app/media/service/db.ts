

export async function SAVEMEDIATODB(mediaUploadFileArr:any) {
    
    const newMedia = await MediaModel.create(file);
    return newMedia;
}