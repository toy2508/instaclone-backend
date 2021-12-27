import { GraphQLUpload } from "graphql-upload";
import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Upload: GraphQLUpload,
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagsObj = null;
        if (caption) {
          //parse caption
          const hashtags = caption.match(/#[\w]+/g);
          //get or create Hashtags
          hashtagsObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }

        return client.photo.create({
          data: {
            file,
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
