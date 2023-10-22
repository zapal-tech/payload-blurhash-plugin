import type { File, GetIncomingFiles } from '../types';

export const getIncomingFiles: GetIncomingFiles = ({ req, data }) => {
  const file = req.files?.file;

  let files: File[] = [];

  if (file && data.filename && data.mimeType) {
    const mainFile: File = {
      filename: data.filename,
      mimeType: data.mimeType,
      buffer: file.data,
      tempFilePath: file.tempFilePath,
      filesize: file.size,
    };

    files = [mainFile];

    if (data?.sizes) {
      Object.entries(data.sizes).forEach(([key, resizedFileData]) => {
        if (req.payloadUploadSizes?.[key] && data.mimeType) {
          files = files.concat([
            {
              filename: `${resizedFileData.filename}`,
              mimeType: data.mimeType,
              buffer: req.payloadUploadSizes[key],
              filesize: req.payloadUploadSizes[key].length,
            },
          ]);
        }
      });
    }
  }

  return files;
};
