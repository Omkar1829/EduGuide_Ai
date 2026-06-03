const profileRepo = require("../repositories/profile.repository");
const prisma = require("../config/prisma");

const getProfile = async (userId) => {
  let profile = await profileRepo.findProfileByUserId(userId);
  if (!profile) {
    profile = await profileRepo.createProfile({ userId });
  }
  return profile;
};

const updateProfile = async (userId, data) => {
  const profile = await getProfile(userId);

  // Check if it is the structured profile wizard payload
  if (data && typeof data === "object" && data.basicInfo && typeof data.basicInfo === "object") {
    const {
      basicInfo = {},
      academicRecords = [],
      interests = [],
      careerGoals = [],
      strengthsWeaknesses = { strengths: [], weaknesses: [] },
      skills = [],
      certifications = [],
    } = data;

    return prisma.$transaction(async (tx) => {
      // Update User if provided in basicInfo or flat payload
      const fName = basicInfo.firstName !== undefined ? basicInfo.firstName : data.firstName;
      const lName = basicInfo.lastName !== undefined ? basicInfo.lastName : data.lastName;

      if (fName !== undefined || lName !== undefined) {
        const userUpdateData = {};
        if (fName !== undefined) userUpdateData.firstName = fName;
        if (lName !== undefined) userUpdateData.lastName = lName;

        await tx.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // 1. Update core student profile fields
      await tx.studentProfile.update({
        where: { id: profile.id },
        data: {
          dateOfBirth: basicInfo.dateOfBirth ? new Date(basicInfo.dateOfBirth) : null,
          gender: basicInfo.gender || null,
          phoneNumber: basicInfo.phoneNumber || null,
          bio: basicInfo.bio || null,
          city: basicInfo.city || null,
          state: basicInfo.state || null,
          country: basicInfo.country || "India",
          address: basicInfo.address || null,
        },
      });

      // 2. Handle Academic Records
      await tx.academicRecord.deleteMany({
        where: { profileId: profile.id },
      });

      if (Array.isArray(academicRecords) && academicRecords.length > 0) {
        for (const record of academicRecords) {
          if (!record.institution) continue;
          await tx.academicRecord.create({
            data: {
              profileId: profile.id,
              institution: record.institution,
              degree: record.degree,
              fieldOfStudy: record.fieldOfStudy,
              year: record.year,
              startYear: record.startYear ? parseInt(record.startYear, 10) : 2020,
              endYear: record.endYear ? parseInt(record.endYear, 10) : null,
              gpa: record.gpa ? parseFloat(record.gpa) : null,
              percentage: record.percentage ? parseFloat(record.percentage) : null,
              isCurrent: typeof record.isCurrent === "boolean" ? record.isCurrent : false,
            },
          });
        }
      }

      // 3. Handle Interests
      await tx.interest.deleteMany({
        where: { profileId: profile.id },
      });

      if (Array.isArray(interests) && interests.length > 0) {
        for (const interest of interests) {
          if (!interest.name) continue;
          await tx.interest.create({
            data: {
              profileId: profile.id,
              name: interest.name,
              category: interest.category || null,
              level: interest.level ? parseInt(interest.level, 10) : 1,
            },
          });
        }
      }

      // 4. Handle Career Goals
      await tx.careerGoal.deleteMany({
        where: { profileId: profile.id },
      });

      if (Array.isArray(careerGoals) && careerGoals.length > 0) {
        for (const goal of careerGoals) {
          if (!goal.title) continue;
          await tx.careerGoal.create({
            data: {
              profileId: profile.id,
              title: goal.title,
              description: goal.description || null,
              targetYear: goal.targetYear ? parseInt(goal.targetYear, 10) : null,
              priority: goal.priority ? parseInt(goal.priority, 10) : 1,
            },
          });
        }
      }

      // 5. Handle Strengths & Weaknesses
      await tx.strength.deleteMany({
        where: { profileId: profile.id },
      });

      const strengthsList = strengthsWeaknesses?.strengths || [];
      if (Array.isArray(strengthsList) && strengthsList.length > 0) {
        for (const str of strengthsList) {
          if (!str.name) continue;
          await tx.strength.create({
            data: {
              profileId: profile.id,
              name: str.name,
              category: str.category || null,
              evidence: str.evidence || null,
            },
          });
        }
      }

      await tx.weakness.deleteMany({
        where: { profileId: profile.id },
      });

      const weaknessesList = strengthsWeaknesses?.weaknesses || [];
      if (Array.isArray(weaknessesList) && weaknessesList.length > 0) {
        for (const weak of weaknessesList) {
          if (!weak.name) continue;
          await tx.weakness.create({
            data: {
              profileId: profile.id,
              name: weak.name,
              category: weak.category || null,
              evidence: weak.evidence || null,
            },
          });
        }
      }

      // 6. Handle Skills
      await tx.studentSkill.deleteMany({
        where: { profileId: profile.id },
      });

      if (Array.isArray(skills) && skills.length > 0) {
        for (const skill of skills) {
          if (!skill.name) continue;

          let masterSkill = await tx.skill.findUnique({
            where: { name: skill.name },
          });

          if (!masterSkill) {
            masterSkill = await tx.skill.create({
              data: {
                name: skill.name,
                category: skill.category || "General",
              },
            });
          }

          await tx.studentSkill.create({
            data: {
              profileId: profile.id,
              skillId: masterSkill.id,
              level: skill.level ? parseInt(skill.level, 10) : 1,
              yearsExp: skill.yearsExp ? parseInt(skill.yearsExp, 10) : null,
            },
          });
        }
      }

      // 7. Handle Certifications
      await tx.certification.deleteMany({
        where: { profileId: profile.id },
      });

      if (Array.isArray(certifications) && certifications.length > 0) {
        for (const cert of certifications) {
          if (!cert.name) continue;
          await tx.certification.create({
            data: {
              profileId: profile.id,
              name: cert.name,
              issuer: cert.issuer || "Unknown",
              issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
              expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
              credentialUrl: cert.credentialUrl || null,
            },
          });
        }
      }

      // 8. Auto-recalculate Profile Completion Percent
      let filled = 0;
      const total = 10;
      if (basicInfo.dateOfBirth) filled++;
      if (basicInfo.gender) filled++;
      if (basicInfo.phoneNumber) filled++;
      if (basicInfo.bio) filled++;
      if (basicInfo.city) filled++;
      if (basicInfo.state) filled++;
      if (academicRecords.length > 0) filled++;
      if (interests.length > 0) filled++;
      if (careerGoals.length > 0) filled++;
      if (skills.length > 0) filled++;

      const pct = Math.round((filled / total) * 100);
      const complete = pct === 100;

      const fullyUpdated = await tx.studentProfile.update({
        where: { id: profile.id },
        data: {
          completionPct: pct,
          profileComplete: complete,
        },
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

      return fullyUpdated;
    }, { timeout: 30000 });
  }

  // Fallback to flat profile updates (settings screen)
  const userFields = {};
  if (data && typeof data === "object") {
    const fName = data.firstName !== undefined ? data.firstName : (data.basicInfo ? data.basicInfo.firstName : undefined);
    const lName = data.lastName !== undefined ? data.lastName : (data.basicInfo ? data.basicInfo.lastName : undefined);

    if (fName !== undefined) userFields.firstName = fName;
    if (lName !== undefined) userFields.lastName = lName;
  }

  if (Object.keys(userFields).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: userFields,
    });
  }

  // Strip user fields before updating profile in the repo to prevent schema validation errors
  const profileData = { ...data };
  delete profileData.firstName;
  delete profileData.lastName;
  delete profileData.basicInfo;

  return profileRepo.updateProfile(profile.id, profileData);
};

const addAcademicRecord = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createAcademicRecord({ ...data, profileId: profile.id });
};

const updateAcademicRecord = async (userId, recordId, data) => {
  const profile = await getProfile(userId);
  const record = await profileRepo.findAcademicRecords(profile.id);
  const found = record.find((r) => r.id === recordId);
  if (!found) {
    const err = new Error("Academic record not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.updateAcademicRecord(recordId, data);
};

const deleteAcademicRecord = async (userId, recordId) => {
  const profile = await getProfile(userId);
  const record = await profileRepo.findAcademicRecords(profile.id);
  const found = record.find((r) => r.id === recordId);
  if (!found) {
    const err = new Error("Academic record not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteAcademicRecord(recordId);
};

const addSubjectMark = async (userId, recordId, data) => {
  const profile = await getProfile(userId);
  const records = await profileRepo.findAcademicRecords(profile.id);
  const found = records.find((r) => r.id === recordId);
  if (!found) {
    const err = new Error("Academic record not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.createSubjectMark({ ...data, academicRecordId: recordId });
};

const deleteSubjectMark = async (userId, markId) => {
  const profile = await getProfile(userId);
  const records = await profileRepo.findAcademicRecords(profile.id);
  const recordIds = records.map((r) => r.id);
  const allMarks = await Promise.all(
    recordIds.map((id) => profileRepo.findSubjectMarks(id))
  );
  const flatMarks = allMarks.flat();
  const found = flatMarks.find((m) => m.id === markId);
  if (!found) {
    const err = new Error("Subject mark not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteSubjectMark(markId);
};

const getInterests = async (userId) => {
  const profile = await getProfile(userId);
  return profileRepo.findInterests(profile.id);
};

const addInterest = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createInterest({ ...data, profileId: profile.id });
};

const removeInterest = async (userId, interestId) => {
  const profile = await getProfile(userId);
  const interests = await profileRepo.findInterests(profile.id);
  const found = interests.find((i) => i.id === interestId);
  if (!found) {
    const err = new Error("Interest not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteInterest(interestId);
};

const getCareerGoals = async (userId) => {
  const profile = await getProfile(userId);
  return profileRepo.findCareerGoals(profile.id);
};

const addCareerGoal = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createCareerGoal({ ...data, profileId: profile.id });
};

const updateCareerGoal = async (userId, goalId, data) => {
  const profile = await getProfile(userId);
  const goals = await profileRepo.findCareerGoals(profile.id);
  const found = goals.find((g) => g.id === goalId);
  if (!found) {
    const err = new Error("Career goal not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.updateCareerGoal(goalId, data);
};

const removeCareerGoal = async (userId, goalId) => {
  const profile = await getProfile(userId);
  const goals = await profileRepo.findCareerGoals(profile.id);
  const found = goals.find((g) => g.id === goalId);
  if (!found) {
    const err = new Error("Career goal not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteCareerGoal(goalId);
};

const getStrengths = async (userId) => {
  const profile = await getProfile(userId);
  return profileRepo.findStrengths(profile.id);
};

const addStrength = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createStrength({ ...data, profileId: profile.id });
};

const removeStrength = async (userId, strengthId) => {
  const profile = await getProfile(userId);
  const strengths = await profileRepo.findStrengths(profile.id);
  const found = strengths.find((s) => s.id === strengthId);
  if (!found) {
    const err = new Error("Strength not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteStrength(strengthId);
};

const getWeaknesses = async (userId) => {
  const profile = await getProfile(userId);
  return profileRepo.findWeaknesses(profile.id);
};

const addWeakness = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createWeakness({ ...data, profileId: profile.id });
};

const removeWeakness = async (userId, weaknessId) => {
  const profile = await getProfile(userId);
  const weaknesses = await profileRepo.findWeaknesses(profile.id);
  const found = weaknesses.find((w) => w.id === weaknessId);
  if (!found) {
    const err = new Error("Weakness not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteWeakness(weaknessId);
};

const getSkills = async (userId) => {
  const profile = await getProfile(userId);
  return profileRepo.findStudentSkills(profile.id);
};

const addSkill = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createStudentSkill({ ...data, profileId: profile.id });
};

const removeSkill = async (userId, skillId) => {
  const profile = await getProfile(userId);
  const skills = await profileRepo.findStudentSkills(profile.id);
  const found = skills.find((s) => s.id === skillId);
  if (!found) {
    const err = new Error("Skill not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteStudentSkill(skillId);
};

const getCertifications = async (userId) => {
  const profile = await getProfile(userId);
  return profileRepo.findCertifications(profile.id);
};

const addCertification = async (userId, data) => {
  const profile = await getProfile(userId);
  return profileRepo.createCertification({ ...data, profileId: profile.id });
};

const updateCertification = async (userId, certId, data) => {
  const profile = await getProfile(userId);
  const certs = await profileRepo.findCertifications(profile.id);
  const found = certs.find((c) => c.id === certId);
  if (!found) {
    const err = new Error("Certification not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.updateCertification(certId, data);
};

const removeCertification = async (userId, certId) => {
  const profile = await getProfile(userId);
  const certs = await profileRepo.findCertifications(profile.id);
  const found = certs.find((c) => c.id === certId);
  if (!found) {
    const err = new Error("Certification not found");
    err.statusCode = 404;
    throw err;
  }
  return profileRepo.deleteCertification(certId);
};

const searchSkills = async (query) => profileRepo.searchSkills(query);

const calculateProfileCompletion = async (userId) => {
  const profile = await getProfile(userId);
  let filled = 0;
  let total = 10;

  if (profile.dateOfBirth) filled++;
  if (profile.gender) filled++;
  if (profile.phoneNumber) filled++;
  if (profile.bio) filled++;
  if (profile.city) filled++;
  if (profile.state) filled++;
  if (profile.academicRecords.length > 0) filled++;
  if (profile.interests.length > 0) filled++;
  if (profile.careerGoals.length > 0) filled++;
  if (profile.skills.length > 0) filled++;

  const pct = Math.round((filled / total) * 100);
  const complete = pct === 100;

  await profileRepo.updateProfile(profile.id, {
    completionPct: pct,
    profileComplete: complete,
  });

  return { completionPct: pct, profileComplete: complete };
};

module.exports = {
  getProfile,
  updateProfile,
  addAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
  addSubjectMark,
  deleteSubjectMark,
  getInterests,
  addInterest,
  removeInterest,
  getCareerGoals,
  addCareerGoal,
  updateCareerGoal,
  removeCareerGoal,
  getStrengths,
  addStrength,
  removeStrength,
  getWeaknesses,
  addWeakness,
  removeWeakness,
  getSkills,
  addSkill,
  removeSkill,
  getCertifications,
  addCertification,
  updateCertification,
  removeCertification,
  searchSkills,
  calculateProfileCompletion,
};
