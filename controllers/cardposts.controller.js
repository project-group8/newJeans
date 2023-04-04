const Boom = require("boom");
const Joi = require("joi");
const CardpostsService = require("../services/cardposts.service");

class CardpostsController {
  constructor() {
    this.cardpostsService = new CardpostsService();
  }

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (req, res, next) => {
    const { splitNumber, splitPageNumber } = req.query;

    try {
      const findSplitCards = await this.cardpostsService.findSplitCards(
        splitNumber,
        splitPageNumber
      );

      if (!findSplitCards) {
        throw Boom.notFound("페이지가 존재하지 않습니다.");
      }

      return res.status(200).json({ postCards: findSplitCards });
    } catch (error) {
      throw error;
    }
  };

  // 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async (req, res, next) => {
    try {
      const hotPostCards = await this.cardpostsService.findHotCards();

      if (!hotPostCards) {
        throw Boom.notFound("인기 있는 게시글이 존재하지 않습니다.");
      }

      return res.status(200).json({ postCards: hotPostCards });
    } catch (error) {
      throw error;
    }
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (req, res, next) => {
    const { postIdx } = req.params;

    try {
      if (!postIdx) {
        throw Boom.badRequest("postIdx가 입력되지 않았습니다.");
      }

      const findOnePost = await this.cardpostsService.findOnePost(postIdx);

      if (!findOnePost) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      return res.status(200).json({ post: findOnePost });
    } catch (error) {
      throw error;
    }
  };

  // 새로운 post를 등록합니다.
  postCard = async (req, res, next) => {
    const { title, category, desc, tag, imgUrl } = req.body;
    const { email } = res.locals.user;

    const messages = {
      "string.base": "이 필드는 문자열로 이루어져야 합니다.",
      "string.empty": "이 필드는 비어 있을 수 없습니다.",
      "any.required": "이 필드는 필수입니다.",
    };

    const Schema = Joi.object({
      title: Joi.string()
        .required()
        .message({
          ...messages,
        }),
      category: Joi.string()
        .required()
        .message({
          ...messages,
        }),
      desc: Joi.string()
        .required()
        .message({
          ...messages,
        }),
    });

    const validate = Schema.validate({
      title: title,
      category: category,
      desc: desc,
    });

    try {
      if (validate.error) {
        throw Boom.badRequest("title, category, desc는 비어있을 수 없습니다.");
      }

      await this.cardpostsService.postCard(
        title,
        category,
        desc,
        tag,
        imgUrl,
        email
      );
      return res.status(200).json({ msg: "게시글 작성에 성공했습니다." });
    } catch (error) {
      throw error;
    }
  };

  // 포스트를 업데이트 합니다.
  updatePost = async (req, res, next) => {
    const { postIdx } = req.params;
    const { title, category, desc, tag, imgUrl } = req.body;

    try {
      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      await this.cardpostsService.updatePost(
        postIdx,
        title,
        category,
        desc,
        tag,
        imgUrl
      );
      return res.status(200).json({ msg: "게시글 수정에 성공했습니다." });
    } catch (error) {
      throw error;
    }
  };

  // 포스트를 삭제합니다.
  deletePost = async (req, res, next) => {
    const { postIdx } = req.params;

    try {
      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      await this.cardpostsService.deletePost(postIdx);
      res.status(200).json({ msg: "게시글 삭제에 성공했습니다." });
    } catch (error) {
      throw error;
    }
  };

  // 포스트에 투표합니다.
  postPoll = async (req, res, next) => {
    const { postIdx } = req.params;
    const { proInputValue, conInputValue } = req.body;
    const { userIdx } = res.locals.user;

    try {
      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      const pollResult = await this.cardpostsService.postPoll(
        userIdx,
        postIdx,
        proInputValue,
        conInputValue
      );

      return res.status(200).json({ pollResult });
    } catch (error) {
      throw error;
    }
  };

  // 포스트에 투표 결과를 봅니다.
  postPollResult = async (req, res, next) => {
    const { postIdx } = req.params;

    try {
      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      const pollResult = await this.cardpostsService.postPollResult(postIdx);
      return res.status(200).json({ pollResult });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CardpostsController;
