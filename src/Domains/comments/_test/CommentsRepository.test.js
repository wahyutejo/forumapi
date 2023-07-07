const CommentsRepository = require('../CommentsRepository');

describe('CommentsRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentsrepository = new CommentsRepository();

    // Action and Assert
    await expect(commentsrepository.addComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(commentsrepository.verifyUserComment('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(commentsrepository.checkAvaibleComment('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(commentsrepository.deleteComment('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(commentsrepository.getDetailComment('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
