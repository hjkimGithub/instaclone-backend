import bcrypt from "bcrypt";
import client from "../client";
import jwt from "jsonwebtoken";

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
        login: async(_, {username, password}) => {
            // find user with args.username
            const user = await client.user.findFirst({
                where: {
                    username,
                },
            })
            if(!user) {
                return {
                    ok: false,
                    error: "User Not Found!",
                };
            }
            // check password with  args.password
            const passwordOk = await bcrypt.compare(password, user.password);
            if(!passwordOk){
                return {
                    ok: false,
                    error: "Incorrect Password!"
                }
            }
            // issue token, send it to the user
            const token = await jwt.sign({id:user.id}, process.env.SECRET_KEY);
            return{
                ok: true,
                token,
            };
        },
    },
};