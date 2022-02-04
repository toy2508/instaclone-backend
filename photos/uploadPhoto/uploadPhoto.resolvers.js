import { GraphQLUpload } from "graphql-upload";
import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Upload: GraphQLUpload,
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagsObj = null;
        if (caption) {
          hashtagsObj = processHashtags(caption);
        }

        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");

        return client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagsObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagsObj,
              },
            }),
          },
        });
      }
    ),
  },
};
