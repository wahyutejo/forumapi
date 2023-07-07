const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTestTableHelper');
const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/reply/entities/AddReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/reply/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add reply and return added reply correctly', async () => {
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
        thread: 'thread-123',
        content: 'comment on thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'balasan komen',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const reply = await ReplyTableTestHelper.findReplyById('reply-123');
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'balasan komen',
          owner: 'user-123',
        })
      );
      expect(reply).toHaveLength(1);
    });
  });

  describe('getDetailReply function', () => {
    it('should get comment detail', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const userPayload1 = {
        id: 'user-123',
        username: 'firstUser',
      };

      const userPayload2 = {
        id: 'user-12345',
        username: 'secondtUser',
      };

      const threadPayload = {
        id: 'thread-1',
        body: 'thread pertama',
        owner: 'user-123',
      };

      const commentPayload = {
        id: 'comment-1',
        thread: 'thread-1',
        content: 'komentar',
        date: '22122023',
        owner: 'user-123',
      };

      const replyPayload1 = {
        id: 'reply-1',
        threadId: 'thread-1',
        commentId: 'comment-1',
        content: 'balasan',
        date: '22122023',
        owner: 'user-123',
        is_delete: false,
      };

      const replyPayload2 = {
        id: 'reply-2',
        threadId: 'thread-1',
        commentId: 'comment-1',
        content: 'balasan kedua',
        date: '23122023',
        owner: 'user-12345',
        is_delete: true,
      };

      await UsersTableTestHelper.addUser(userPayload1);
      await UsersTableTestHelper.addUser(userPayload2);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentTableTestHelper.addComment(commentPayload);
      await ReplyTableTestHelper.addReply(replyPayload1);
      await ReplyTableTestHelper.addReply(replyPayload2);

      // Action
      const detailReply = await replyRepositoryPostgres.getDetailReply(threadPayload.id);

      // Assert
      expect(detailReply[0].id).toEqual(replyPayload1.id);
      expect(detailReply[0].username).toEqual(userPayload1.username);
      expect(detailReply[0].date).toEqual(replyPayload1.date);
      expect(detailReply[0].content).toEqual(replyPayload1.content);
      expect(detailReply[0].comment).toEqual(commentPayload.id);
      expect(detailReply[0].is_delete).toEqual(replyPayload1.is_delete);
      expect(detailReply[1].id).toEqual(replyPayload2.id);
      expect(detailReply[1].username).toEqual(userPayload2.username);
      expect(detailReply[1].date).toEqual(replyPayload2.date);
      expect(detailReply[1].content).toEqual(replyPayload2.content);
      expect(detailReply[1].comment).toEqual(commentPayload.id);
      expect(detailReply[1].is_delete).toEqual(replyPayload2.is_delete);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
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

      await ReplyTableTestHelper.addReply({
        id: 'reply-1',
        threadId: 'thread-1',
        commentId: 'comment-1',
        content: 'balasan',
        owner: 'user-123',
      });

      const replyId = 'reply-1';

      // Action
      await replyRepositoryPostgres.deleteReply(replyId);

      // Assert
      const isDelete = await ReplyTableTestHelper.checkDeleteStatus(replyId);
      expect(isDelete).toEqual(true);
    });
  });

  describe('verifyUserReply function', () => {
    it('should throw AuthorizationError if reply not owned by user', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
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
        id: 'comment-1',
        thread: 'thread-123',
        content: 'komentar',
        owner: 'user-123',
      });

      await ReplyTableTestHelper.addReply({
        id: 'reply-1',
        threadId: 'thread-123',
        commentId: 'comment-1',
        content: 'balasan',
        owner: 'user-123',
      });

      const replyId = 'reply-1';
      const owner = 'user-12';

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyUserReply(replyId, owner)).rejects.toThrow(
        AuthorizationError
      );
    });

    it('should not throw AuthorizationError if reply owned by user', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
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

      await ReplyTableTestHelper.addReply({
        id: 'reply-1',
        threadId: 'thread-1',
        commentId: 'comment-1',
        content: 'balasan',
        owner: 'user-123',
      });

      const replyId = 'reply-1';
      const owner = 'user-123';

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyUserReply(replyId, owner)).resolves.not.toThrow(
        AuthorizationError
      );
    });
  });

  describe('checkAvaibleReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'xxx';

      // Action and Assert
      await expect(replyRepositoryPostgres.checkAvaibleReply(replyId)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw NotFoundError when reply avaible', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
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

      await ReplyTableTestHelper.addReply({
        id: 'reply-1',
        threadId: 'thread-1',
        commentId: 'comment-1',
        content: 'balasan',
        owner: 'user-123',
      });

      const replyId = 'reply-1';

      // Action and Assert
      await expect(replyRepositoryPostgres.checkAvaibleReply(replyId)).resolves.not.toThrow(
        NotFoundError
      );
    });
  });
});
