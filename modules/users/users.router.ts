import { Router, Request, Response } from "express";
import UsersController from "./users.controller";
import cors from "cors";
import { isAuthenticated } from "../authentication/authentication.middlewares";
import multer from "multer";
import { validateUpdateUserRequest, validateUserId } from "./users.validators";
import { validateFileExtension } from "../utils/fileExtensionValidator";

const storageEngine = multer.diskStorage({
  destination: "public/images/users/",
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/").pop();
    //console.log(file.mimetype); image/jpeg
    cb(null, `${req.params.userId}.${extension}`);
  },
});

const upload = multer({ storage: storageEngine }); // Destination folder for uploaded files

const router = Router();

router.use(cors({ origin: "*" }));

router.get("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await UsersController.getUsers(req);
  res.status(statusCode).send(body);
});

router.get("/details", isAuthenticated, async (req: Request, res: Response) => {
  const { statusCode, body } = await UsersController.getUserDetails(req);
  res.status(statusCode).send(body);
});

router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { statusCode, body } = await UsersController.getUserById(req, userId);
  res.status(statusCode).send(body);
});

router.post("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await UsersController.addUser(req, req.body);
  res.status(statusCode).send(body);
});

router.put(
  "/:userId",
  isAuthenticated,
  validateUpdateUserRequest,
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { statusCode, body } = await UsersController.updateUser(
      req,
      userId,
      req.body
    );
    res.status(statusCode).send(body);
  }
);

router.post(
  "/upload/:userId",
  isAuthenticated,
  validateUserId,
  upload.single("picture"),
  validateFileExtension,
  async (req: Request, res: Response) => {
    // console.log(req.params);
    // console.log(req.body);
    console.log(req.file?.filename);
    const { userId } = req.params;
    const { statusCode, body } = await UsersController.updateUser(req, userId, {
      picture: req.file?.filename,
    });
    res.status(statusCode).send(body);
  }
);

export default router;
