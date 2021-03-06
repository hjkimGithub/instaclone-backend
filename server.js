// import dotenv from "dotenv";
require("dotenv").config();
import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import logger from "morgan";
// import schema from "./schema";
import {typeDefs, resolvers} from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

const PORT = process.env.PORT;

const apollo = new ApolloServer({
    // schema,
    resolvers,
    typeDefs,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
          // protectResolver,
        };  
      } else {
        const {
          connection: {context},
        } = ctx;
        return {
          loggedInUser: context.loggedInUser
        }
      }
    },
    subscriptions: {
      // connection parameter(headers), right after listening
      onConnect: async ({token}) => {
        if(!token) {
          throw new Error("Not Allowed to listen!!!")
        }
        const loggedInUser = await getUser(token);
        return {
          loggedInUser,
        };
      },
    },
});

const app = express();
app.use(logger("tiny"));
apollo.applyMiddleware({app});
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer)

httpServer
  .listen(PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
  })
  // .listen(PORT)
  // .then(() => console.log(`Server is running on http://localhost:${PORT}/`));