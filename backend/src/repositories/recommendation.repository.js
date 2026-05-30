const prisma = require("../config/prisma");

const findByUserId = async (userId, type, status, pagination = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = { userId };

  if (type) {
    where.type = type;
  }
  if (status) {
    where.status = status;
  }

  const [recommendations, total] = await Promise.all([
    prisma.recommendation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.recommendation.count({ where }),
  ]);

  return {
    recommendations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findById = async (id) => {
  return prisma.recommendation.findUnique({ where: { id } });
};

const create = async (data) => {
  return prisma.recommendation.create({ data });
};

const updateStatus = async (id, status) => {
  return prisma.recommendation.update({
    where: { id },
    data: { status },
  });
};

const deleteExpired = async () => {
  return prisma.recommendation.deleteMany({
    where: {
      status: "EXPIRED",
      expiresAt: { lt: new Date() },
    },
  });
};

const findByUserAndType = async (userId, type) => {
  return prisma.recommendation.findMany({
    where: { userId, type },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  findByUserId,
  findById,
  create,
  updateStatus,
  deleteExpired,
  findByUserAndType,
};
