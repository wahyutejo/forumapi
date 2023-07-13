const LikesRepository = require('../../Domains/likesThreadComment/LikesRepository');

class LikesThreadCommentRepositoryPostgres extends LikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikes(threadId, commentId, user) {
    const id = `likes-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id, thread_id, comment_id, user_id',
      values: [id, threadId, commentId, user],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async disLikes(threadId, commentId, user) {
    const query = {
      text: 'DELETE FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
      values: [threadId, commentId, user],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyLikesUser(commentId, user) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, user],
    };
    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async getLikeCount(threadId) {
    const query = {
      text: 'SELECT * FROM likes WHERE thread_id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikesThreadCommentRepositoryPostgres;
