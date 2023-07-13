const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikesThreadCommentUseCase = require('../LikesThreadCommentUseCase');
const LikesRepository = require('../../../Domains/likesThreadComment/LikesRepository');

describe('LikesThreadCommentUseCase', () => {
  it('should add likes thread comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      user: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentsRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.checkAvaibilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvaibleComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikesRepository.verifyLikesUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));
    mockLikesRepository.addLikes = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve());

    const likesThreadCommentUseCase = new LikesThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesThreadCommentRepository: mockLikesRepository,
    });

    // Action
    await likesThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvaibilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvaibleComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikesRepository.verifyLikesUser).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.user
    );

    expect(mockLikesRepository.addLikes).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.user
    );
  });

  it('should dislike likes thread comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      user: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentsRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.checkAvaibilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvaibleComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikesRepository.verifyLikesUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockLikesRepository.disLikes = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve());

    const likesThreadCommentUseCase = new LikesThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesThreadCommentRepository: mockLikesRepository,
    });

    // Action
    await likesThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvaibilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvaibleComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikesRepository.verifyLikesUser).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.user
    );

    expect(mockLikesRepository.disLikes).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.user
    );
  });
});
