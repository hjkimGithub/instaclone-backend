import client from "../../client";
import { uploadToS3 } from "../../shared/shares.utils";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(
        async(_, {file, caption}, {loggedInUser}) => {
            let hashtagObj = [];
            if(caption) {
                // parse caption, create hashtags
                hashtagObj = processHashtags(caption);
                // console.log(hashtagObj);
            }
            const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
            // save the photo with the parsed hashtags
            // add the photo to the hashtags
            return client.photo.create({
                data: {
                    file: fileUrl,
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