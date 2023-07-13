const LikesThreadComment = require('../../Domains/likesThreadComment/entites/LikesThreadComment');

class LikesThreadCommentUseCase {
  constructor({ threadRepository, commentRepository, likesThreadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likesThreadCommentRepository = likesThreadCommentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, user } = new LikesThreadComment(useCasePayload);

    await this._threadRepository.checkAvaibilityThread(threadId);
    await this._commentRepository.checkAvaibleComment(commentId);
    const like = await this._likesThreadCommentRepository.verifyLikesUser(commentId, user);

    if (like === 0) {
      await this._likesThreadCommentRepository.addLikes(threadId, commentId, user);
    }
    if (like === 1) {
      await this._likesThreadCommentRepository.disLikes(threadId, commentId, user);
    }
  }
}

module.exports = LikesThreadCommentUseCase;
