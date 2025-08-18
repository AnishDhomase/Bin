import FileFolderModel from "../models/fileFolder.model.js";

export const getFileAnalysis = async (userId) => {
  const files = await FileFolderModel.find({
    isFolder: false,
    userId,
  }).populate({
    path: "cloudinaryAssetId",
    select: "-publicId",
  });
  console.log(files);
  return getSizeOverview(files);
};

const getSizeOverview = (files) => {
  const analytics = {
    image: { items: 0, size: 0 },
    document: { items: 0, size: 0 },
    other: { items: 0, size: 0 },
    trash: { items: 0, size: 0 },
  };

  files.forEach((file) => {
    const { mimetype, size } = file.cloudinaryAssetId;
    if (file.isTrash) {
      analytics.trash.size += size;
      analytics.trash.items += 1;
    } else if (mimetype.startsWith("image/")) {
      analytics.image.size += size;
      analytics.image.items += 1;
    } else if (mimetype.startsWith("application/")) {
      analytics.document.size += size;
      analytics.document.items += 1;
    } else {
      analytics.other.size += size;
      analytics.other.items += 1;
    }
  });

  const storageLimit = parseInt(process.env.USER_STORAGE_LIMIT, 10);
  const freeSize =
    storageLimit -
    (analytics.image.size +
      analytics.document.size +
      analytics.other.size +
      analytics.trash.size);

  return {
    free: {
      size: freeSize,
    },
    ...analytics,
  };
};
