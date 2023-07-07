const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating get detail thread correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'judul',
      body: 'body thread',
      date: '20062023',
      username: 'user a',
    };

    const expectedComment = [
      {
        id: 'comment-1',
        username: 'user b',
        date: '20062124',
        content: 'komentar',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'user c',
        date: '21062124',
        content: 'komentar kedua',
        is_delete: false,
      },
    ];

    const expectedReply = [
      {
        id: 'reply-1',
        username: 'user b',
        date: '20062124',
        content: 'balasan',
        comment: 'comment-1',
        threadId: 'thread-123',
        is_delete: false,
      },
      {
        id: 'reply-2',
        username: 'user d',
        date: '21062124',
        content: 'balasan kedua',
        comment: 'comment-1',
        threadId: 'thread-123',
        is_delete: true,
      },
      {
        id: 'reply-3',
        username: 'user d',
        date: '22062124',
        content: 'balasan ketiga',
        comment: 'comment-2',
        threadId: 'thread-123',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentsRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkAvaibilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    mockCommentRepository.getDetailComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    mockReplyRepository.getDetailReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    detailThreadUseCase._detailComment(expectedComment);
    detailThreadUseCase._detailReply(expectedReply);

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvaibilityThread).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getDetailComment).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getDetailReply).toBeCalledWith(useCasePayload);
    expect(detailThread).toStrictEqual({
      id: 'thread-123',
      title: 'judul',
      body: 'body thread',
      date: '20062023',
      username: 'user a',
      comments: [
        {
          id: 'comment-1',
          username: 'user b',
          date: '20062124',
          content: 'komentar',
          replies: [
            {
              id: 'reply-1',
              username: 'user b',
              date: '20062124',
              content: 'balasan',
            },
            {
              id: 'reply-2',
              username: 'user d',
              date: '21062124',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'user c',
          date: '21062124',
          content: 'komentar kedua',
          replies: [
            {
              id: 'reply-3',
              username: 'user d',
              date: '22062124',
              content: 'balasan ketiga',
            },
          ],
        },
      ],
    });
  });

  it('should return comments correctly', async () => {
    const comment = [
      {
        id: 'comment-1',
        username: 'user b',
        date: '20062124',
        content: 'komentar',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'user c',
        date: '21062124',
        content: 'komentar kedua',
        is_delete: true,
      },
    ];

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const spyComment = jest.spyOn(detailThreadUseCase, '_detailComment');

    // Action
    detailThreadUseCase._detailComment(comment);

    // Assert
    expect(spyComment).toReturnWith([
      {
        id: 'comment-1',
        username: 'user b',
        date: '20062124',
        content: 'komentar',
      },
      {
        id: 'comment-2',
        username: 'user c',
        date: '21062124',
        content: '**komentar telah dihapus**',
      },
    ]);
    spyComment.mockClear();
  });

  it('should return replies correctly', async () => {
    const reply = [
      {
        id: 'reply-1',
        username: 'user b',
        date: '20062124',
        content: 'balasan',
        comment: 'comment-1',
        threadId: 'thread-123',
        is_delete: false,
      },
      {
        id: 'reply-2',
        username: 'user d',
        date: '21062124',
        content: 'balasan kedua',
        comment: 'comment-1',
        threadId: 'thread-123',
        is_delete: true,
      },
      {
        id: 'reply-3',
        username: 'user d',
        date: '22062124',
        content: 'balasan ketiga',
        comment: 'comment-2',
        threadId: 'thread-123',
        is_delete: false,
      },
    ];

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const spyReply = jest.spyOn(detailThreadUseCase, '_detailReply');

    // Action
    detailThreadUseCase._detailReply(reply);

    // Assert
    expect(spyReply).toReturnWith([
      {
        id: 'reply-1',
        username: 'user b',
        date: '20062124',
        content: 'balasan',
        comment: 'comment-1',
      },
      {
        id: 'reply-2',
        username: 'user d',
        date: '21062124',
        content: '**balasan telah dihapus**',
        comment: 'comment-1',
      },
      {
        id: 'reply-3',
        username: 'user d',
        date: '22062124',
        content: 'balasan ketiga',
        comment: 'comment-2',
      },
    ]);
    spyReply.mockClear();
  });
});
