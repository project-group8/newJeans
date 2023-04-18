const PreferService = require("../services/prefer.service");
const CardpostsRepository = require("../repositories/cardposts.repository");
const Boom = require("boom");
class PreferController {
  constructor() {
    this.preferService = new PreferService();
    this.cardpostsRepository = new CardpostsRepository();
  }

  /**
   * 포스트에 투표합니다.
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  postPoll = async (req, res, next) => {
    const { postIdx } = req.params;
    const { proInputValue, conInputValue } = req.body;
    const { email } = res.locals.user;

    try {
      if (!email) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      const findOneUser = await this.cardpostsRepository.findOneUser(email);
      const userIdx = findOneUser.userIdx;
      const pollResult = await this.preferService.postPoll(
        userIdx,
        postIdx,
        proInputValue,
        conInputValue
      );

      return res.status(200).json({ pollResult });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 포스트에 투표 결과를 봅니다.
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  postPollResult = async (req, res, next) => {
    const { postIdx } = req.params;

    try {
      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      const pollResult = await this.preferService.postPollResult(postIdx);
      return res.status(200).json({ pollResult });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PreferController;
