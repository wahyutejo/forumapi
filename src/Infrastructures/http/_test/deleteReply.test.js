const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTestTableHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('delete comment in thread', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 if payload not access token', async () => {
      // Arrange
      const userPayload = {
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      };
      const server = await createServer(container);

      // login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const responseAuth = JSON.parse(auth.payload);

      const threadId = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul',
          body: 'body thread',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseThread = JSON.parse(threadId.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseComment = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 'balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseReply = JSON.parse(reply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when reply not owned by user', async () => {
      // Arrange
      // user A
      const userPayload = {
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      };
      const server = await createServer(container);

      // login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const responseAuth = JSON.parse(auth.payload);

      const threadId = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul',
          body: 'body thread',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseThread = JSON.parse(threadId.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseComment = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 'balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseReply = JSON.parse(reply.payload);

      // user B
      const userBPayload = {
        username: 'userb',
        password: 'secretB',
        fullname: 'User B',
      };

      // user B login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userBPayload,
      });

      const authUserB = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userBPayload.username,
          password: userBPayload.password,
        },
      });

      const responseAuthUserB = JSON.parse(authUserB.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
        headers: { Authorization: `Bearer ${responseAuthUserB.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak bisa menghapus balasan ini');
    });

    it('should response 404 when reply not found', async () => {
      // Arrange
      const userPayload = {
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      };
      const server = await createServer(container);

      // login
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const responseAuth = JSON.parse(auth.payload);

      const threadId = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul',
          body: 'body thread',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseThread = JSON.parse(threadId.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseComment = JSON.parse(comment.payload);

      const reply = 'reply-11';
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${reply}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Id balasan tidak ditemukan');
    });

    it('should response 200 when delete reply', async () => {
      // Arrange
      const userPayload = {
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password,
        },
      });

      const responseAuth = JSON.parse(auth.payload);

      const threadId = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul',
          body: 'body thread',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseThread = JSON.parse(threadId.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseComment = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 'balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseReply = JSON.parse(reply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
