const AddReply = require('../../Domains/reply/entities/AddReply');

class AddReplyCommentThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);

    const { threadId, commentId } = useCasePayload;

    await this._threadRepository.checkAvaibilityThread(threadId);
    await this._commentRepository.checkAvaibleComment(commentId);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyCommentThreadUseCase;
