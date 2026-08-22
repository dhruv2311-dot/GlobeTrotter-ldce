import { Router } from 'express';
import * as controller from '../controllers/community.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPostSchema, listPostsSchema, postIdSchema, updatePostSchema } from '../validators/sprint5.validator';

const router = Router();
router.get('/posts', validate(listPostsSchema), controller.listPosts);
router.get('/posts/:postId', validate(postIdSchema), controller.getPost);
router.post('/posts', authMiddleware, validate(createPostSchema), controller.createPost);
router.patch('/posts/:postId', authMiddleware, validate(updatePostSchema), controller.updatePost);
router.delete('/posts/:postId', authMiddleware, validate(postIdSchema), controller.deletePost);
export default router;
