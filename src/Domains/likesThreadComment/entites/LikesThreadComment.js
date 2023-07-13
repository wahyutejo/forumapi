class LikesThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, commentId, user } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.user = user;
  }

  _verifyPayload({ threadId, commentId, user }) {
    if (!threadId || !commentId || !user) {
      throw new Error('LIKES_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof user !== 'string') {
      throw new Error('LIKES_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikesThreadComment;
