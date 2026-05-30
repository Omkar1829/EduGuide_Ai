const prisma = require("../config/prisma");

const findProfileByUserId = (userId) =>
  prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      academicRecords: { include: { subjectMarks: true } },
      interests: true,
      careerGoals: true,
      strengths: true,
      weaknesses: true,
      skills: { include: { skill: true } },
      certifications: true,
    },
  });

const createProfile = (data) =>
  prisma.studentProfile.create({ data });

const updateProfile = (id, data) =>
  prisma.studentProfile.update({ where: { id }, data });

const findAcademicRecords = (profileId) =>
  prisma.academicRecord.findMany({
    where: { profileId },
    include: { subjectMarks: true },
    orderBy: { startYear: "desc" },
  });

const createAcademicRecord = (data) =>
  prisma.academicRecord.create({ data });

const updateAcademicRecord = (id, data) =>
  prisma.academicRecord.update({ where: { id }, data });

const deleteAcademicRecord = (id) =>
  prisma.academicRecord.delete({ where: { id } });

const findSubjectMarks = (academicRecordId) =>
  prisma.subjectMark.findMany({
    where: { academicRecordId },
    orderBy: { createdAt: "desc" },
  });

const createSubjectMark = (data) =>
  prisma.subjectMark.create({ data });

const deleteSubjectMark = (id) =>
  prisma.subjectMark.delete({ where: { id } });

const findInterests = (profileId) =>
  prisma.interest.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });

const createInterest = (data) =>
  prisma.interest.create({ data });

const deleteInterest = (id) =>
  prisma.interest.delete({ where: { id } });

const findCareerGoals = (profileId) =>
  prisma.careerGoal.findMany({
    where: { profileId },
    orderBy: { priority: "asc" },
  });

const createCareerGoal = (data) =>
  prisma.careerGoal.create({ data });

const updateCareerGoal = (id, data) =>
  prisma.careerGoal.update({ where: { id }, data });

const deleteCareerGoal = (id) =>
  prisma.careerGoal.delete({ where: { id } });

const findStrengths = (profileId) =>
  prisma.strength.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });

const createStrength = (data) =>
  prisma.strength.create({ data });

const deleteStrength = (id) =>
  prisma.strength.delete({ where: { id } });

const findWeaknesses = (profileId) =>
  prisma.weakness.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });

const createWeakness = (data) =>
  prisma.weakness.create({ data });

const deleteWeakness = (id) =>
  prisma.weakness.delete({ where: { id } });

const findStudentSkills = (profileId) =>
  prisma.studentSkill.findMany({
    where: { profileId },
    include: { skill: true },
    orderBy: { createdAt: "desc" },
  });

const createStudentSkill = (data) =>
  prisma.studentSkill.create({ data });

const deleteStudentSkill = (id) =>
  prisma.studentSkill.delete({ where: { id } });

const findCertifications = (profileId) =>
  prisma.certification.findMany({
    where: { profileId },
    orderBy: { issueDate: "desc" },
  });

const createCertification = (data) =>
  prisma.certification.create({ data });

const updateCertification = (id, data) =>
  prisma.certification.update({ where: { id }, data });

const deleteCertification = (id) =>
  prisma.certification.delete({ where: { id } });

const findSkills = (category) =>
  prisma.skill.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: "asc" },
  });

const searchSkills = (query) =>
  prisma.skill.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
    take: 20,
  });

module.exports = {
  findProfileByUserId,
  createProfile,
  updateProfile,
  findAcademicRecords,
  createAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
  findSubjectMarks,
  createSubjectMark,
  deleteSubjectMark,
  findInterests,
  createInterest,
  deleteInterest,
  findCareerGoals,
  createCareerGoal,
  updateCareerGoal,
  deleteCareerGoal,
  findStrengths,
  createStrength,
  deleteStrength,
  findWeaknesses,
  createWeakness,
  deleteWeakness,
  findStudentSkills,
  createStudentSkill,
  deleteStudentSkill,
  findCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  findSkills,
  searchSkills,
};
