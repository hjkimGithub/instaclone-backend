// import dotenv from "dotenv";
require("dotenv").config();
import { ApolloServer } from "apollo-server";
// import { typeDefs, resolvers } from "./schema";
import schema from "./schema";

const server = new ApolloServer({
    schema,
});

const PORT = process.env.PORT

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}/`));