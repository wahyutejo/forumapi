const DetailThread = require('../DetailThread');

describe('Detail Thread entities', () => {
  it('should throw new error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'judul',
      body: 'body thread',
      date: '20062023',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'judul',
      body: 'body thread',
      date: '20062023',
      username: 123,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should GET detail thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'judul',
      body: 'body thread',
      date: '20062023',
      username: 'user a',
    };

    // Action
    const { id, title, body, date, username } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
