require("dotenv").config();
import { ApolloServer, gql } from "apollo-server";
import schema from "./scheme";

const server = new ApolloServer({ schema });
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
});
