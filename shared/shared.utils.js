import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file, userId, args) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const newFileName = `${args}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-uploader",
      Key: newFileName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();

  return Location;
};
