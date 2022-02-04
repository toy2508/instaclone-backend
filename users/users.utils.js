import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    //in case of no token

    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await client.user.findUnique({ where: { id } });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const protectedResolver =
  (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      console.log(info);
      const query = info.operation.operation == "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
