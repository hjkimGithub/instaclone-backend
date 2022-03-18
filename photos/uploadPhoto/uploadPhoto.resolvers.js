import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(
        async(_, {file, caption}, {loggedInUser}) => {
            let hashtagObj = [];
            if(caption) {
                // parse caption, create hashtags
                const hashtags = caption.match(/#[\w]+/g);
                hashtagObj = hashtags.map((hashtag) => ({
                    where: {
                        hashtag
                    },
                    create: {
                        hashtag
                    },
                }));
                // console.log(hashtagObj);
            }
            // save the photo with the parsed hashtags
            // add the photo to the hashtags
            return client.photo.create({
                data: {
                    file,
                    caption,
                    user: {
                        connect: {
                            id: loggedInUser.id,
                        },
                    },
                    ...(hashtagObj.length > 0 && ({
                        hashtags: {
                            connectOrCreate: hashtagObj,
                        }
                    })),
                },
            });
        })
    }
}