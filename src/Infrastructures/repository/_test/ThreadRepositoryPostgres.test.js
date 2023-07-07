const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123';
      const newThread = new AddThread({
        title: 'judul thread',
        body: 'body thread',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'judul thread',
          owner: 'user-123',
        })
      );
      expect(thread).toHaveLength(1);
    });
  });

  describe('getDetailThread function', () => {
    it('should persist detail thread correctly', async () => {
      // Arrange
      const userPayload = {
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        id: 'thread-123',
        title: 'judul thread',
        body: 'body thread',
        date: '20052023',
        owner: 'user-123',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);

      // Action
      const detailThread = await threadRepositoryPostgres.getDetailThread('thread-123');

      // Assert
      expect(detailThread.id).toEqual(threadPayload.id);
      expect(detailThread.title).toEqual(threadPayload.title);
      expect(detailThread.body).toEqual(threadPayload.body);
      expect(detailThread.date).toEqual(threadPayload.date);
      expect(detailThread.username).toEqual(userPayload.username);
    });
  });

  describe('checkAvaibilityThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'xxx';

      // Action and Assert
      await expect(threadRepositoryPostgres.checkAvaibilityThread(threadId)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw NotFoundError when thread avaible', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'firstUser',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-1',
        body: 'thread pertama',
        owner: 'user-123',
      });

      const threadId = 'thread-1';

      // Action and Assert
      await expect(threadRepositoryPostgres.checkAvaibilityThread(threadId)).resolves.not.toThrow(
        NotFoundError
      );
    });
  });
});
