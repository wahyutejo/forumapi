const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.verifyThreadOwner('')).rejects.toThrowError(
      'THREAD_OWNER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.checkAvaibilityThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.getDetailThread('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
