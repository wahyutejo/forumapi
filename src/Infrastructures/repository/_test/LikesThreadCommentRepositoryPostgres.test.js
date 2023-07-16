const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikesThreadComment = require('../../../Domains/likesThreadComment/entites/LikesThreadComment');
const LikesThreadCommentRepositoryPostgres = require('../LikesThreadCommentRepositoryPostgres');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikesThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLikes function', () => {
    it('should add likes correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        body: 'thread pertama',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment on thread',
        owner: 'user-123',
      });

      const payload = new LikesThreadComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        user: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likesThreadCommentRepositoryPostgres = new LikesThreadCommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const likes = await likesThreadCommentRepositoryPostgres.addLikes(
        payload.threadId,
        payload.commentId,
        payload.user
      );

      // Assert
      const likeComment = await LikesTableTestHelper.findLikesUser('likes-123');
      expect(likes).toStrictEqual({
        id: 'likes-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        user_id: 'user-123',
      });
      expect(likeComment).toHaveLength(1);
    });
  });

  describe('disLike function', () => {
    it('should dislike comment', async () => {
      // Arrange
      const likesThreadCommentRepositoryPostgres = new LikesThreadCommentRepositoryPostgres(
        pool,
        {}
      );
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        body: 'thread pertama',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-1',
        thread: 'thread-1',
        content: 'komentar',
        owner: 'user-123',
      });

      await LikesTableTestHelper.addLikes({
        id: 'likes-1',
        threadId: 'thread-1',
        commentId: 'comment-1',
        user: 'user-123',
      });

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const user = 'user-123';

      // Action
      await likesThreadCommentRepositoryPostgres.disLikes(threadId, commentId, user);

      // Assert
      const dislike = await LikesTableTestHelper.findLikesUser('likes-1');
      expect(dislike).toHaveLength(0);
    });
  });

  describe('verifyLikesUser function', () => {
    it('should return length 0 when user not found', async () => {
      // Arrange
      const likesThreadCommentRepositoryPostgres = new LikesThreadCommentRepositoryPostgres(
        pool,
        {}
      );

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-12',
        username: 'secondUser',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        body: 'thread pertama',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment on thread',
        owner: 'user-123',
      });

      await LikesTableTestHelper.addLikes({
        id: 'likes-1',
        threadId: 'thread-123',
        commentId: 'comment-123',
        user: 'user-123',
      });

      const commentId = 'comment-1';
      const user = 'user-12';

      // Action

      const response = await likesThreadCommentRepositoryPostgres.verifyLikesUser(commentId, user);

      // Assert
      expect(response).toEqual(0);
    });

    it('should return length 1 when user found', async () => {
      // Arrange
      const likesThreadCommentRepositoryPostgres = new LikesThreadCommentRepositoryPostgres(
        pool,
        {}
      );

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        body: 'thread pertama',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment on thread',
        owner: 'user-123',
      });

      await LikesTableTestHelper.addLikes({
        id: 'likes-1',
        threadId: 'thread-123',
        commentId: 'comment-123',
        user: 'user-123',
      });

      const commentId = 'comment-123';
      const user = 'user-123';

      // Action

      const response = await likesThreadCommentRepositoryPostgres.verifyLikesUser(commentId, user);

      // Assert
      const like = await LikesTableTestHelper.findLikesUser('likes-1');
      expect(like).toHaveLength(1);
      expect(response).toEqual(1);
    });
  });

  describe('getLikeCount function', () => {
    it('should get all like comment in thread', async () => {
      // Arrange
      const likesThreadCommentRepositoryPostgres = new LikesThreadCommentRepositoryPostgres(
        pool,
        {}
      );
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        body: 'thread pertama',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-1',
        thread: 'thread-1',
        content: 'komentar',
        owner: 'user-123',
      });

      await LikesTableTestHelper.addLikes({
        id: 'likes-1',
        threadId: 'thread-1',
        commentId: 'comment-1',
        user: 'user-123',
      });

      // Second user likes
      await UsersTableTestHelper.addUser({
        id: 'user-1',
        username: 'newUser',
      });

      await LikesTableTestHelper.addLikes({
        id: 'likes-2',
        threadId: 'thread-1',
        commentId: 'comment-1',
        user: 'user-1',
      });

      const threadId = 'thread-1';

      // Action
      const like = await likesThreadCommentRepositoryPostgres.getLikeCount(threadId);

      // Assert
      expect(like).toHaveLength(2);
    });
  });
});
