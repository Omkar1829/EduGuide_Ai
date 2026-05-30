const prisma = require("../config/prisma");

const findByUserId = async (userId, pagination = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;

  const [userCourses, total] = await Promise.all([
    prisma.userCourse.findMany({
      where: { userId },
      include: { course: true },
      skip,
      take: limit,
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.userCourse.count({ where: { userId } }),
  ]);

  return {
    userCourses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findByUserAndCourse = async (userId, courseId) => {
  return prisma.userCourse.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
};

const enroll = async (data) => {
  return prisma.userCourse.create({ data });
};

const updateProgress = async (userId, courseId, progress) => {
  const updateData = { progress };
  if (progress >= 100) {
    updateData.completedAt = new Date();
    updateData.status = "completed";
  }

  return prisma.userCourse.update({
    where: { userId_courseId: { userId, courseId } },
    data: updateData,
  });
};

const unenroll = async (userId, courseId) => {
  return prisma.userCourse.delete({
    where: { userId_courseId: { userId, courseId } },
  });
};

module.exports = {
  findByUserId,
  findByUserAndCourse,
  enroll,
  updateProgress,
  unenroll,
};
