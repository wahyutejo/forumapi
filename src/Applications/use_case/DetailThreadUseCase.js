class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likesThreadCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likesThreadCommentRepository = likesThreadCommentRepository;
  }

  async execute(useCasePayload) {
    const threadId = useCasePayload;

    await this._threadRepository.checkAvaibilityThread(threadId);
    const thread = await this._threadRepository.getDetailThread(threadId);
    const commentDetail = await this._commentRepository.getDetailComment(threadId);
    const allComments = this._detailComment(commentDetail);
    const replyDetail = await this._replyRepository.getDetailReply(threadId);
    const allReplies = this._detailReply(replyDetail);
    const allLikesComment = await this._likesThreadCommentRepository.getLikeCount(threadId);

    const comments = [];
    for (let i = 0; i < allComments.length; i += 1) {
      const replies = allReplies
        .filter((r) => r.comment === allComments[i].id)
        .map((r) => ({
          id: r.id,
          content: r.content,
          date: r.date,
          username: r.username,
        }));

      replies.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

      const likeCount = allLikesComment.filter(
        (like) => like.comment_id === allComments[i].id
      ).length;

      const comment = { ...allComments[i], likeCount, replies };

      comments.push(comment);
    }

    const detailThread = { ...thread, comments };

    return detailThread;
  }

  _detailComment(comment) {
    const newComment = [];

    comment.forEach((c) => {
      if (c.is_delete === true) {
        const deleteComment = {
          id: c.id,
          username: c.username,
          date: c.date,
          content: '**komentar telah dihapus**',
        };

        newComment.push(deleteComment);
      }
      if (c.is_delete === false) {
        const unDeleteComment = {
          id: c.id,
          username: c.username,
          date: c.date,
          content: c.content,
        };

        newComment.push(unDeleteComment);
      }
    });

    return newComment;
  }

  _detailReply(reply) {
    const newReply = [];

    reply.forEach((r) => {
      if (r.is_delete === true) {
        const deleteReply = {
          id: r.id,
          content: '**balasan telah dihapus**',
          date: r.date,
          username: r.username,
          comment: r.comment,
        };

        newReply.push(deleteReply);
      }
      if (r.is_delete === false) {
        const unDeleteReply = {
          id: r.id,
          content: r.content,
          date: r.date,
          username: r.username,
          comment: r.comment,
        };

        newReply.push(unDeleteReply);
      }
    });
    return newReply;
  }
}

module.exports = DetailThreadUseCase;
