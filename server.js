import { ApolloServer } from "apollo-server";
// import { typeDefs, resolvers } from "./schema";
import schema from "./schema";

const server = new ApolloServer({
    schema,
});
server
  .listen()
  .then(() => console.log("Server is running on http://localhost:4000/"));