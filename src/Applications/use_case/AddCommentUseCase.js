const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    const { thread } = useCasePayload;

    await this._threadRepository.checkAvaibilityThread(thread);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
