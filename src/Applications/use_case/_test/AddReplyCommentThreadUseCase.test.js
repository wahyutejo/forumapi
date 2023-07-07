const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const AddedReply = require('../../../Domains/reply/entities/AddedReply');
const AddReply = require('../../../Domains/reply/entities/AddReply');
const AddReplyUseCase = require('../AddReplyCommentThreadUseCase');

describe('AddReplyCommentThreadUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'balasan komentar',
      owner: 'user-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentsRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkAvaibilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvaibleComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'balasan komentar',
        owner: 'user-123',
      })));

    const getReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.checkAvaibilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvaibleComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });
});
