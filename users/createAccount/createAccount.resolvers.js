import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (
            _, 
            { firstName, lastName, username, email, password } 
            ) => {
               try {
                    // check if username or email are already on DB
                    const existingUser = await client.user.findFirst({
                        where: {
                            OR: [
                                {
                                    username,
                                },
                                {
                                    email,
                                },
                            ],
                        },
                    });
                    if(existingUser) {
                        throw new Error("This username/ email is already taken.");
                    }
                    // hash password
                    const uglyPassword = await bcrypt.hash(password, 10);
                    // save, return the user
                    return client.user.create({
                        data: {
                            username,
                            email,
                            firstName,
                            lastName,
                            password: uglyPassword,
                        }
                    })
                    // same as
                    // const user = await ~~~
                    // return user
               } catch(e) {
                    return e;
               }
        },
    },
};