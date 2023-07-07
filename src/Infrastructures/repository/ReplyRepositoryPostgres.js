const ReplyRepository = require('../../Domains/reply/ReplyRepository');
const AddedReply = require('../../Domains/reply/entities/AddedReply');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { threadId, commentId, content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, FALSE) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getDetailReply(threadId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete, replies.comment
      FROM replies INNER JOIN users ON replies.owner = users.id WHERE replies.thread = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async verifyUserReply(replyId, owner) {
    const query = {
      text: 'SELECT id, owner FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak bisa menghapus balasan ini');
    }
  }

  async checkAvaibleReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Id balasan tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
