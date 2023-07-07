const DetailComment = require('../DetailComment');

describe('Detail Comment entities', () => {
  it('should throw new error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      username: 'user a',
      date: '20062023',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      username: 123,
      date: '20062023',
      content: 'komentar',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should GET detail comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      username: 'user a',
      date: '20062023',
      content: 'komentar',
    };

    // Action
    const { id, username, date, content } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
