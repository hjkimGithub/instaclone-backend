import { AddArgumentsAsVariables, withFilter } from "apollo-server-express";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
    Subscription: {
        roomUpdates: {
            // subscribe: () => pubsub.asyncIterator(NEW_MESSAGE);
            subscribe: async(root, args, context, info) => {
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
                        id: true
                    }
                });
                if(!room) {
                    // return null;
                    // "Subscription field must return Async Iterable. Received: null."
                    throw new Error("Not allowed!!!")
                }
                // want to listen that are allowed to loggedInUser
                return withFilter(
                    // iterator
                    () => pubsub.asyncIterator(NEW_MESSAGE),
                    // decision function(must be Boolean)
                    async ({roomUpdates}, {id}, {loggedInUser}) => {
                        if(roomUpdates.roomId === id) {
                            const room = await client.room.findFirst({
                                where: {
                                    id,
                                    users: {
                                        some: {
                                            id: loggedInUser.id,
                                        },
                                    }
                                },
                                select: {
                                    id: true,
                                },
                            });
                            if(!room) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                )(root, args, context, info);
            }
        }
    }
}