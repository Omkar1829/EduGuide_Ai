const prisma = require("../config/prisma");

const findAll = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = { isActive: true };

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.company) {
    where.company = { contains: filters.company, mode: "insensitive" };
  }
  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }
  if (filters.experience) {
    where.experience = { contains: filters.experience, mode: "insensitive" };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { postedAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findById = async (id) => {
  return prisma.job.findUnique({ where: { id } });
};

const create = async (data) => {
  return prisma.job.create({ data });
};

const update = async (id, data) => {
  return prisma.job.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.job.delete({ where: { id } });
};

const findByCategory = async (category) => {
  return prisma.job.findMany({
    where: { category, isActive: true },
    orderBy: { postedAt: "desc" },
  });
};

const search = async (query) => {
  return prisma.job.findMany({
    where: {
      isActive: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { postedAt: "desc" },
  });
};

const findBySkills = async (skills) => {
  return prisma.job.findMany({
    where: {
      isActive: true,
      skills: { hasSome: skills },
    },
    orderBy: { postedAt: "desc" },
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
  findBySkills,
};
