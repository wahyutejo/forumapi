const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
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
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when comment not owned by user', async () => {
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
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
        headers: { Authorization: `Bearer ${responseAuthUserB.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak bisa menghapus komentar ini');
    });

    it('should response 404 when comment not found', async () => {
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

      const comment = 'comment-100';
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${comment}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Id komentar tidak ditemukan');
    });

    it('should response 200 when delete comment', async () => {
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
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
