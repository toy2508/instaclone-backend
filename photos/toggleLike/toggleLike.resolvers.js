import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    toggleLike: protectedResolver(async (_, { id }, { loggedInUser }) => {
      //find the photo to set like
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
      });

      // if it don't find photo by id, it make error's response
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found",
        };
      }

      // unique key composed by two words
      const likeWhere = {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      };

      const like = await client.like.findUnique({
        where: likeWhere,
      });

      if (like) {
        await client.like.delete({
          where: likeWhere,
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }

      return {
        ok: true,
      };
    }),
  },
};
