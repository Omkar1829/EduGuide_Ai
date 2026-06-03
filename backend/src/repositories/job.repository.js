const prisma = require("../config/prisma");

const findAll = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const andConditions = [{ isActive: true }];

  if (filters.category) {
    andConditions.push({ category: filters.category });
  }
  if (filters.type) {
    andConditions.push({ type: filters.type });
  }
  if (filters.company) {
    andConditions.push({ company: { contains: filters.company, mode: "insensitive" } });
  }
  if (filters.experience) {
    andConditions.push({ experience: { contains: filters.experience, mode: "insensitive" } });
  }
  if (filters.location) {
    const locations = filters.location.split(',').map(l => l.trim()).filter(Boolean);
    if (locations.length > 0) {
      andConditions.push({
        OR: locations.map(loc => ({
          location: { contains: loc, mode: "insensitive" }
        }))
      });
    }
  }
  if (filters.search) {
    andConditions.push({
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { company: { contains: filters.search, mode: "insensitive" } },
        { location: { contains: filters.search, mode: "insensitive" } },
        { category: { contains: filters.search, mode: "insensitive" } },
      ]
    });
  }

  const where = { AND: andConditions };

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
