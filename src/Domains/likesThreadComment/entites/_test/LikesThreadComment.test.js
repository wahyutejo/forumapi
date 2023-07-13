const LikesThreadComment = require('../LikesThreadComment');

describe('Likes Thread Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      user: 'user-123',
    };

    // Action and Assert
    expect(() => new LikesThreadComment(payload)).toThrowError(
      'LIKES_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      user: {},
    };

    // Action and Assert
    expect(() => new LikesThreadComment(payload)).toThrowError(
      'LIKES_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should add likes object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      user: 'user-123',
    };

    // Action
    const { threadId, commentId, user } = new LikesThreadComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(user).toEqual(payload.user);
  });
});
