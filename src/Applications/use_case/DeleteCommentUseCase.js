const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const comment = new DeleteComment(useCasePayload);

    await this._threadRepository.checkAvaibilityThread(comment.threadId);
    await this._commentRepository.checkAvaibleComment(comment.commentId);
    await this._commentRepository.verifyUserComment(comment.commentId, comment.owner);
    await this._commentRepository.deleteComment(comment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
