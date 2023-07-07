const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('get detail thread /threads/{threadId}', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when GET /threads/{threadId}', () => {
    it('should return 200 when get thread details', async () => {
      // Arrange
      const server = await createServer(container);

      const userPayload = {
        username: 'user',
        password: 'secret',
        fullname: 'User A',
      };

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

      // create thread
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

      // create comment
      await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'komentar',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${responseThread.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
