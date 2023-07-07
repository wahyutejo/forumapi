const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 if payload not access token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload meet data type specification', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 123,
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak bisa membuat komentar karena tipe data tidak sesuai'
      );
    });

    it('should  response 400 when payload not contain needed property', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          fakeContent: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak bisa membuat komentar karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 404 when thread not found', async () => {
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
      const threadId = 'thread-xxx';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 201 and create comment', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 201 and comment with different user', async () => {
      // Arrange
      const server = await createServer(container);

      // User 1
      const payloadUser1 = {
        username: 'user1',
        password: 'secret1',
        fullname: 'User 1',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser1,
      });

      const responseAuthUser1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUser1.username,
          password: payloadUser1.password,
        },
      });

      const authUser1 = JSON.parse(responseAuthUser1.payload);

      //  user 1 add thread
      const responseThreadUser1 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Thread user 1',
          body: 'body thread user 1',
        },
        headers: { Authorization: `Bearer ${authUser1.data.accessToken}` },
      });

      const threadUser1 = JSON.parse(responseThreadUser1.payload);

      // User 2
      const payloadUser2 = {
        username: 'User2',
        password: 'secret2',
        fullname: 'User 2',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUser2,
      });

      const responseAuthUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUser2.username,
          password: payloadUser2.password,
        },
      });

      const authUser2 = JSON.parse(responseAuthUser2.payload);

      // Action
      // User 2 create comment

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadUser1.data.addedThread.id}/comments`,
        payload: {
          content: 'User 2 comment on thread user 1',
        },
        headers: { Authorization: `Bearer ${authUser2.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
