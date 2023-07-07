const DeleteReply = require('../../Domains/reply/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const reply = new DeleteReply(useCasePayload);

    await this._threadRepository.checkAvaibilityThread(reply.threadId);
    await this._commentRepository.checkAvaibleComment(reply.commentId);
    await this._replyRepository.checkAvaibleReply(reply.replyId);
    await this._replyRepository.verifyUserReply(reply.replyId, reply.owner);
    await this._replyRepository.deleteReply(reply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
