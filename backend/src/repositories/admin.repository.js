const prisma = require("../config/prisma");

const getAllUsers = async (pagination, filters = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = {};

  if (filters.role) {
    where.role = filters.role;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true";
  }
  if (filters.isVerified !== undefined) {
    where.isVerified = filters.isVerified === "true";
  }
  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            phoneNumber: true,
            city: true,
            state: true,
            country: true,
            completionPct: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      isActive: true,
      avatarUrl: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          dateOfBirth: true,
          gender: true,
          phoneNumber: true,
          address: true,
          city: true,
          state: true,
          country: true,
          bio: true,
          profileComplete: true,
          completionPct: true,
          academicRecords: true,
          interests: true,
          careerGoals: true,
          strengths: true,
          weaknesses: true,
          skills: { include: { skill: true } },
          certifications: true,
        },
      },
      _count: {
        select: {
          recommendations: true,
          careerRoadmaps: true,
          quizzes: true,
          userCourses: true,
          userJobs: true,
        },
      },
    },
  });
};

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      isActive: true,
      avatarUrl: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};

const toggleUserActive = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!user) return null;

  return prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
    },
  });
};

const getUserStats = async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, newThisWeek, byRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } },
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    }),
  ]);

  return {
    totalUsers,
    newThisWeek,
    byRole: byRole.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {}),
  };
};

const getAllCourses = async (pagination, filters = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = {};

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.level) {
    where.level = filters.level;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true";
  }
  if (filters.provider) {
    where.provider = { contains: filters.provider, mode: "insensitive" };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { provider: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { userCourses: true },
        },
      },
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

const getCourseById = async (id) => {
  return prisma.course.findUnique({
    where: { id },
    include: {
      _count: {
        select: { userCourses: true },
      },
      userCourses: {
        select: {
          id: true,
          status: true,
          progress: true,
          enrolledAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
        take: 10,
      },
    },
  });
};

const createCourse = async (data) => {
  return prisma.course.create({ data });
};

const updateCourse = async (id, data) => {
  return prisma.course.update({ where: { id }, data });
};

const deleteCourse = async (id) => {
  return prisma.course.delete({ where: { id } });
};

const getCourseStats = async () => {
  const [totalCourses, activeCourses, enrolledTotal, byCategory] =
    await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { isActive: true } }),
      prisma.userCourse.count(),
      prisma.course.groupBy({
        by: ["category"],
        _count: { id: true },
        where: { isActive: true },
      }),
    ]);

  return {
    totalCourses,
    activeCourses,
    enrolledTotal,
    byCategory: byCategory.map((item) => ({
      category: item.category,
      count: item._count.id,
    })),
  };
};

const getAllJobs = async (pagination, filters = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = {};

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true";
  }
  if (filters.company) {
    where.company = { contains: filters.company, mode: "insensitive" };
  }
  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { company: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { postedAt: "desc" },
      include: {
        _count: {
          select: { userJobs: true },
        },
      },
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

const getJobById = async (id) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      _count: {
        select: { userJobs: true },
      },
      userJobs: {
        select: {
          id: true,
          status: true,
          appliedAt: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
};

const createJob = async (data) => {
  return prisma.job.create({ data });
};

const updateJob = async (id, data) => {
  return prisma.job.update({ where: { id }, data });
};

const deleteJob = async (id) => {
  return prisma.job.delete({ where: { id } });
};

const getJobStats = async () => {
  const [totalJobs, activeJobs, savedTotal, byCategory] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.userJob.count(),
    prisma.job.groupBy({
      by: ["category"],
      _count: { id: true },
      where: { isActive: true },
    }),
  ]);

  return {
    totalJobs,
    activeJobs,
    savedTotal,
    byCategory: byCategory.map((item) => ({
      category: item.category,
      count: item._count.id,
    })),
  };
};

const getPlatformStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalCourses,
    activeCourses,
    totalJobs,
    activeJobs,
    totalRecommendations,
    totalQuizzes,
    totalChatSessions,
    totalResumes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.course.count({ where: { isActive: true } }),
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.recommendation.count(),
    prisma.quiz.count(),
    prisma.chatHistory.groupBy({ by: ["sessionId"] }).then((s) => s.length),
    prisma.resumeAnalysis.count(),
  ]);

  return {
    users: { total: totalUsers, students: totalStudents },
    courses: { total: totalCourses, active: activeCourses },
    jobs: { total: totalJobs, active: activeJobs },
    recommendations: totalRecommendations,
    quizzes: totalQuizzes,
    chatSessions: totalChatSessions,
    resumes: totalResumes,
  };
};

const getRecentActivity = async (limit = 20) => {
  const [recentUsers, recentCourses, recentJobs, recentRecommendations] =
    await Promise.all([
      prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.course.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          provider: true,
          category: true,
          createdAt: true,
        },
      }),
      prisma.job.findMany({
        take: limit,
        orderBy: { postedAt: "desc" },
        select: {
          id: true,
          title: true,
          company: true,
          category: true,
          postedAt: true,
        },
      }),
      prisma.recommendation.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

  const activities = [
    ...recentUsers.map((u) => ({
      type: "user_registered",
      entity: u,
      timestamp: u.createdAt,
    })),
    ...recentCourses.map((c) => ({
      type: "course_created",
      entity: c,
      timestamp: c.createdAt,
    })),
    ...recentJobs.map((j) => ({
      type: "job_posted",
      entity: j,
      timestamp: j.postedAt,
    })),
    ...recentRecommendations.map((r) => ({
      type: "recommendation_created",
      entity: r,
      timestamp: r.createdAt,
    })),
  ];

  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return activities.slice(0, limit);
};

const getAnalyticsData = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [usersOverTime, coursesOverTime, jobsOverTime, usersByRole] =
    await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.course.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.job.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      }),
    ]);

  const groupByMonth = (items) => {
    const monthly = {};
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = (monthly[key] || 0) + 1;
    });
    return Object.entries(monthly).map(([month, count]) => ({ month, count }));
  };

  return {
    usersOverTime: groupByMonth(usersOverTime),
    coursesOverTime: groupByMonth(coursesOverTime),
    jobsOverTime: groupByMonth(jobsOverTime),
    usersByRole: usersByRole.map((item) => ({
      role: item.role,
      count: item._count.id,
    })),
  };
};

const getAllQuizzes = async (pagination, filters = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;
  const where = {};

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { user: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { user: { lastName: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const [quizzes, total] = await Promise.all([
    prisma.quiz.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        results: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.quiz.count({ where }),
  ]);

  return {
    quizzes: quizzes.map((q) => ({
      ...q,
      studentName: q.user ? `${q.user.firstName} ${q.user.lastName}` : "Unknown Student",
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getQuizById = async (id) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      results: true,
    },
  });
};

const deleteQuiz = async (id) => {
  return prisma.quiz.delete({ where: { id } });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActive,
  getUserStats,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getPlatformStats,
  getRecentActivity,
  getAnalyticsData,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
};
