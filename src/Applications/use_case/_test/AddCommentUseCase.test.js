const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange

    const useCasePayload = {
      thread: 'thread-123',
      content: 'thread comment',
      owner: 'user-123',
    };

    const expectAddedComment = new AddedComment({
      id: 'comment-123',
      thread: useCasePayload.thread,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvaibilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          thread: 'thread-123',
          content: 'thread comment',
          owner: 'user-123',
        })
      ));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvaibilityThread).toBeCalledWith(useCasePayload.thread);
    expect(addedComment).toStrictEqual(expectAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        thread: useCasePayload.thread,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });
});
