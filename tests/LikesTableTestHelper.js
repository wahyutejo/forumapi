/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLikes({
    id = 'likes-1',
    threadId = 'thread-123',
    commentId = 'comment-123',
    user = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id, thread_id, comment_id, user_id',
      values: [id, threadId, commentId, user],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikesUser(id) {
    const query = {
      text: 'SELECT id FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
