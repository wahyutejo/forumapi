const DeleteReply = require('../DeleteReply');

describe('Delete reply entities', () => {
  it('should throw new error when payload did not contain property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should delete reply object correctly', () => {
    // Arrange
    const payload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-223',
    };

    // Action
    const { replyId, commentId, threadId, owner } = new DeleteReply(payload);

    // Assert
    expect(replyId).toEqual(payload.replyId);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
