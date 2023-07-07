/* eslint-disable camelcase */
/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async addReply({
    id = 'reply-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    content = 'balasan komentar',
    owner = 'user-234',
    date = '12232023',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, threadId, commentId, content, owner, date, is_delete],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async checkDeleteStatus(id) {
    const query = {
      text: 'SELECT is_delete FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].is_delete;
  },
};

module.exports = ReplyTableTestHelper;
