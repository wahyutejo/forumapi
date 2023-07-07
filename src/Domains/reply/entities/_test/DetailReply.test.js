const DetailReply = require('../DetailReply');

describe('Detail Reply entities', () => {
  it('should throw new error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-1',
      username: 'user a',
      date: '20062023',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-1',
      username: 123,
      date: '20062023',
      content: 'komentar',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should GET detail reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-1',
      username: 'user a',
      date: '20062023',
      content: 'sebuah balasan',
    };

    // Action
    const { id, username, date, content } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
