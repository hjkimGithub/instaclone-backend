import client from "../../client";

export default {
    Query: {
        searchUsers: async (_, { keyword, lastId}) => client.user.findMany({
            where: {
                OR: [
                    {username: {
                        mode:"insensitive",
                        startsWith: keyword,
                    }}, 
                    {firstName: {
                        mode:"insensitive",
                        contains: keyword,
                    }},
                    {lastName: {
                        mode:"insensitive",
                        contains: keyword,
                    }},
                ]
            },
            take: 3,
            skip: lastId ? 1:0,
            ...(lastId && {cursor: {id: lastId}}),
      })
    },
};