const AddComment = require('../AddComment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'comment',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      content: 'comment',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create new Comment object correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      content: 'komentar',
      owner: 'user-123',
    };

    // Action
    const { thread, content, owner } = new AddComment(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
