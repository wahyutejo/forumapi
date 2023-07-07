const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        body: 'thread pertama',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const addComment = new AddComment({
        thread: 'thread-123',
        content: 'comment on thread',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'comment on thread',
          owner: 'user-123',
        })
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe('verifyUserComment function', () => {
    it('should throw AuthorizationError if comment not owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-12',
        username: 'secondUser',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        body: 'thread pertama',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-1',
        thread: 'thread-123',
        content: 'komentar',
        owner: 'user-123',
      });

      const commentId = 'comment-1';
      const owner = 'user-12';

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyUserComment(commentId, owner)).rejects.toThrow(
        AuthorizationError
      );
    });

    it('should not throw AuthorizationError if comment owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadTableTestHelper.addThread({
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

      const commentId = 'comment-1';
      const owner = 'user-123';

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyUserComment(commentId, owner)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('checkAvaibleComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'xxx';

      // Action and Assert
      await expect(commentRepositoryPostgres.checkAvaibleComment(commentId)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw NotFoundError when comment avaible', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadTableTestHelper.addThread({
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

      const commentId = 'comment-1';

      // Action and Assert
      await expect(commentRepositoryPostgres.checkAvaibleComment(commentId)).resolves.not.toThrow(
        NotFoundError
      );
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadTableTestHelper.addThread({
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

      const commentId = 'comment-1';

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const isDelete = await CommentTableTestHelper.checkDeleteStatus(commentId);
      expect(isDelete).toEqual(true);
    });
  });

  describe('getDetailComment function', () => {
    it('should get comment detail', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const userPayload1 = {
        id: 'user-123',
        username: 'firstUser',
      };

      const userPayload2 = {
        id: 'user-1245',
        username: 'secondUser',
      };

      const threadPayload = {
        id: 'thread-1',
        body: 'thread pertama',
        owner: 'user-123',
      };

      const commentPayload1 = {
        id: 'comment-1',
        thread: 'thread-1',
        content: 'komentar',
        date: '22122023',
        owner: 'user-123',
        is_delete: false,
      };

      const commentPayload2 = {
        id: 'comment-2',
        thread: 'thread-1',
        content: 'komentar kedua',
        date: '23122023',
        owner: 'user-1245',
        is_delete: true,
      };

      await UsersTableTestHelper.addUser(userPayload1);
      await UsersTableTestHelper.addUser(userPayload2);
      await ThreadTableTestHelper.addThread(threadPayload);
      await CommentTableTestHelper.addComment(commentPayload1);
      await CommentTableTestHelper.addComment(commentPayload2);

      // Action
      const detailComment = await commentRepositoryPostgres.getDetailComment('thread-1');

      // Assert
      expect(detailComment[0].id).toEqual(commentPayload1.id);
      expect(detailComment[0].username).toEqual(userPayload1.username);
      expect(detailComment[0].date).toEqual(commentPayload1.date);
      expect(detailComment[0].content).toEqual(commentPayload1.content);
      expect(detailComment[0].is_delete).toEqual(commentPayload1.is_delete);
      expect(detailComment[1].id).toEqual(commentPayload2.id);
      expect(detailComment[1].username).toEqual(userPayload2.username);
      expect(detailComment[1].date).toEqual(commentPayload2.date);
      expect(detailComment[1].content).toEqual(commentPayload2.content);
      expect(detailComment[1].is_delete).toEqual(commentPayload2.is_delete);
    });
  });
});
