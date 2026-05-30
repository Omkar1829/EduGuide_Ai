const prisma = require("../config/prisma");

const findAll = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = { isActive: true };

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.level) {
    where.level = filters.level;
  }
  if (filters.provider) {
    where.provider = { contains: filters.provider, mode: "insensitive" };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = Number(filters.minPrice);
    if (filters.maxPrice !== undefined) where.price.lte = Number(filters.maxPrice);
  }
  if (filters.minRating !== undefined) {
    where.rating = { gte: Number(filters.minRating) };
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findById = async (id) => {
  return prisma.course.findUnique({ where: { id } });
};

const create = async (data) => {
  return prisma.course.create({ data });
};

const update = async (id, data) => {
  return prisma.course.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.course.delete({ where: { id } });
};

const findByCategory = async (category) => {
  return prisma.course.findMany({
    where: { category, isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

const search = async (query) => {
  return prisma.course.findMany({
    where: {
      isActive: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { provider: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  findByCategory,
  search,
};
