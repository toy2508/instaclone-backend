import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constans";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!room) {
          throw new Error("You should not see this!");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdates }, { id }) => {
            return roomUpdates.roomId === id;
          }
        )(root, args, context, info);
      },
    },
  },
};
