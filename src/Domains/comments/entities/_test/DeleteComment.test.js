const DeleteComment = require('../DeleteComment');

describe('Delete comment entities', () => {
  it('should throw new error when payload did not contain property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 123,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should delete comment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-223',
    };

    // Action
    const { commentId, threadId, owner } = new DeleteComment(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
