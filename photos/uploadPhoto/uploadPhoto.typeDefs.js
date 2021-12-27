import { gql } from "apollo-server-express";

export default gql`
  scalar Upload
  type Mutation {
    uploadPhoto(file: String!, caption: String): Photo
  }
`;
