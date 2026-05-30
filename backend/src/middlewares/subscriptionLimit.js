const prisma = require("../config/prisma");
const { AppError } = require("./errorHandler");

const TIER_LIMITS = {
  NEWBIE: 5,
  PRO: 20,
  PRO_PLUS: 50,
};

const checkChatLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const now = new Date();
    const lastReset = new Date(user.lastLimitReset || now);
    const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);

    let chatLimitRemaining = user.chatLimitRemaining;

    // Reset daily limit if 24 hours have passed
    if (hoursSinceReset >= 24) {
      chatLimitRemaining = TIER_LIMITS[user.subscriptionTier] || 5;
      await prisma.user.update({
        where: { id: userId },
        data: {
          chatLimitRemaining,
          lastLimitReset: now,
        },
      });
    }

    if (chatLimitRemaining <= 0) {
      return next(
        new AppError(
          `Daily chat limit reached for your ${user.subscriptionTier} subscription. Please upgrade to chat more!`,
          403
        )
      );
    }

    // Decrement the chat limit remaining
    await prisma.user.update({
      where: { id: userId },
      data: {
        chatLimitRemaining: chatLimitRemaining - 1,
      },
    });

    next();
  } catch (error) {
    next(error);
  }
};

const enforceTier = (requiredTiers) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      if (!requiredTiers.includes(user.subscriptionTier)) {
        return next(
          new AppError(
            `This premium feature requires a ${requiredTiers.join(" or ")} subscription. Please upgrade!`,
            403
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  checkChatLimit,
  enforceTier,
};
