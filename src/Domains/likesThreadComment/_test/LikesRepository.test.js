const LikesRepository = require('../LikesRepository');

describe('LikesRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likesRepository = new LikesRepository();

    // Action and Assert
    await expect(likesRepository.addLikes({})).rejects.toThrowError(
      'LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likesRepository.verifyLikesUser('')).rejects.toThrowError(
      'LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likesRepository.disLikes({})).rejects.toThrowError(
      'LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likesRepository.getLikeCount('')).rejects.toThrowError(
      'LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});

module.exports = LikesRepository;
