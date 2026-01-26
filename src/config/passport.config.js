import passport from "passport";
import jwt from "passport-jwt";
import UserModel from "../models/User.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET || "coderhouse"
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id);
          if (!user) return done(null, false);

          return done(null, {
            id: user._id,
            email: user.email,
            role: user.role
          });
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export default initializePassport;

