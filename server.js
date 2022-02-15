require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { graphqlUploadExpress } from "graphql-upload";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs, resolvers } from "./scheme";
import { getUser } from "./users/users.utils";
import express from "express";
import logger from "morgan";

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  const apollo = new ApolloServer({
    schema,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
        };
      } else {
        const {
          connection: { context },
        } = ctx;

        return {
          loggedInUser: context.loggedInUser,
        };
      }
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await apollo.start();
  const app = express();
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  apollo.applyMiddleware({ app });

  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async ({ token }, webSocket, context) => {
        if (!token) {
          throw new Error("You can't listen.");
        }
        const loggedInUser = await getUser(token);
        return {
          loggedInUser,
        };
      },
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );

  const PORT = process.env.PORT;
  await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}
startServer();
