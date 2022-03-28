import { gql } from "apollo-server";

export default gql`
    type Mutation {
        sendMessage(payload:String!, roodId:Int, userId:Int): MutationResponse!
    }
`;