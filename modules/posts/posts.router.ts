import { Router, Request, Response } from "express";
import { isAuthenticated } from "../authentication/authentication.middlewares";
import PostsController from "./posts.controller";
import multer from "multer";
import { KeywordsFilter, PostFilters } from "./posts.models";
import {
  validateAddPostRequest,
  validatePostId,
  validateUpdatePostRequest,
} from "./posts.validators";
import { validateFileExtension } from "../utils/fileExtensionValidator";

const storageEngine = multer.diskStorage({
  destination: "public/images/posts/",
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/").pop();
    //console.log(file.mimetype); image/jpeg
    if (req.params.postId) {
      cb(null, `${req.params.postId}.${extension}`);
    } else {
      cb(null, `temporary.${extension}`);
    }
  },
});

const upload = multer({ storage: storageEngine }); // Destination folder for uploaded files

const router = Router();

router.get(
  "/",
  async (
    req: Request<unknown, unknown, unknown, PostFilters>,
    res: Response
  ) => {
    const filters: PostFilters = req.query;
    const { statusCode, body } = await PostsController.getPosts(filters);
    res.status(statusCode).send(body);
  }
);

router.get(
  "/keywordsFilter",
  async (
    req: Request<unknown, unknown, unknown, KeywordsFilter>,
    res: Response
  ) => {
    const { words } = req.query;
    const { statusCode, body } = await PostsController.getPostsByKeywords(
      words
    );
    res.status(statusCode).send(body);
  }
);

// GET POSTS FOR USER - e ok sa am asa endpointu /posts/user
router.get("/user", isAuthenticated, async (req: Request, res: Response) => {
  console.log("posts for user");
  const { statusCode, body } = await PostsController.getPostsForUser(req);
  res.status(statusCode).send(body);
});

router.post(
  "/imageFilter",
  upload.single("picture"),
  validateFileExtension,
  async (req: Request, res: Response) => {
    console.log(req.files);
    console.log(req.file?.filename);
    const { statusCode, body } = await PostsController.filterByPicture(
      req,
      req.file?.filename!
    );
    res.status(statusCode).send(body);
  }
);

router.get("/:postId", validatePostId, async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { statusCode, body } = await PostsController.getPostById(req, postId);
  res.status(statusCode).send(body);
});

router.delete(
  "/:postId",
  isAuthenticated,
  validatePostId,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { statusCode, body } = await PostsController.deletePost(req, postId);
    res.status(statusCode).send(body);
  }
);

router.post(
  "/",
  isAuthenticated,
  validateAddPostRequest,
  async (req: Request, res: Response) => {
    console.log("add post");
    const { statusCode, body } = await PostsController.addPost(req, req.body);
    res.status(statusCode).send(body);
  }
);

router.post(
  "/upload/:postId",
  isAuthenticated,
  validatePostId,
  upload.single("picture"),
  validateFileExtension,
  async (req: Request, res: Response) => {
    // console.log(req.params);
    // console.log(req.body);
    console.log(req.file?.filename);
    const { postId } = req.params;
    const { statusCode, body } = await PostsController.uploadPostPicture(
      req,
      postId,
      req.file?.filename!
    );
    res.status(statusCode).send(body);
  }
);

router.put(
  "/:postId",
  validateUpdatePostRequest,
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { statusCode, body } = await PostsController.updatePost(
      req,
      postId,
      req.body
    );
    res.status(statusCode).send(body);
  }
);

export default router;
