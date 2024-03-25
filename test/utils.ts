import jwt from "jsonwebtoken";

const generateToken = (username: string) => {
    return jwt.sign(
        { username },
        process.env.JWT_SECRET as string
      );
}

export {
    generateToken
}