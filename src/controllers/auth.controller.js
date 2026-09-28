import logger from "#config/looger.js";
import { signInSchema, signUpSchema } from "#validations/auth.validations.js";
import { formatValidationError } from "#utils/format.js";
import { authenticateUser, createUser } from "#services/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

const signUp = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    if(!validationResult.success) {
      return res.status(400).json({
        error: "Validation error",
        details: formatValidationError(validationResult.error)
      });
    }

    const {name, email, password, role} = validationResult.data;

    const user = await createUser({name, email,password , role});

    const token = jwttoken.sign({id: user.id, email:user.email, role:user.role});

    cookies.set(res, "token", token);

    logger.info(`User registered sucssfully: ${email}`);

    res.status(201).json({
      msg: "User registered",
      user: {
        id: user.id, name: user.name, email: user.email, role: user.role
      }
    });
  } catch (error) {
    logger.error("Sign-up Error", error);

    if (error.massage === "User with this email already exists") {
      return res.status(409).json({ error: "Email already exists" });
    }

    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if(!validationResult.success) {
      return res.status(400).json({
        error: "Validation error",
        details: formatValidationError(validationResult.error)
      });
    }

    const {email, password} = validationResult.data;

    const user = await authenticateUser(email, password);
    
    const token = jwttoken.sign({id: user.id, email:user.email, role:user.role});

    cookies.set(res, "token", token);

    logger.info(`User signed in successfully: ${email}`);

    res.status(200).json({
      msg: "User signed in",
      user: {
        id: user.id, name: user.name, email: user.email, role: user.role
      }
    });

  } catch (error) {
    logger.error("Sign-in Error", error);
    next(error);
  }
};

const signOut = (req, res) => {

  cookies.clear(res, "token");

  res.json({msg: "User logged out successfully"});
};

export { signIn, signOut, signUp };