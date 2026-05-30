const profileService = require("../services/profile.service");
const { success, error } = require("../utils/apiResponse");

const getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return success(res, profile, "Profile fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return success(res, profile, "Profile updated successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addAcademicRecord = async (req, res) => {
  try {
    const record = await profileService.addAcademicRecord(req.user.id, req.body);
    return success(res, record, "Academic record added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateAcademicRecord = async (req, res) => {
  try {
    const record = await profileService.updateAcademicRecord(
      req.user.id,
      req.params.recordId,
      req.body
    );
    return success(res, record, "Academic record updated");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const deleteAcademicRecord = async (req, res) => {
  try {
    await profileService.deleteAcademicRecord(req.user.id, req.params.recordId);
    return success(res, null, "Academic record deleted");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addSubjectMark = async (req, res) => {
  try {
    const mark = await profileService.addSubjectMark(
      req.user.id,
      req.params.recordId,
      req.body
    );
    return success(res, mark, "Subject mark added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const deleteSubjectMark = async (req, res) => {
  try {
    await profileService.deleteSubjectMark(req.user.id, req.params.markId);
    return success(res, null, "Subject mark deleted");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getInterests = async (req, res) => {
  try {
    const interests = await profileService.getInterests(req.user.id);
    return success(res, interests, "Interests fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addInterest = async (req, res) => {
  try {
    const interest = await profileService.addInterest(req.user.id, req.body);
    return success(res, interest, "Interest added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeInterest = async (req, res) => {
  try {
    await profileService.removeInterest(req.user.id, req.params.interestId);
    return success(res, null, "Interest removed");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getCareerGoals = async (req, res) => {
  try {
    const goals = await profileService.getCareerGoals(req.user.id);
    return success(res, goals, "Career goals fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addCareerGoal = async (req, res) => {
  try {
    const goal = await profileService.addCareerGoal(req.user.id, req.body);
    return success(res, goal, "Career goal added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateCareerGoal = async (req, res) => {
  try {
    const goal = await profileService.updateCareerGoal(
      req.user.id,
      req.params.goalId,
      req.body
    );
    return success(res, goal, "Career goal updated");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeCareerGoal = async (req, res) => {
  try {
    await profileService.removeCareerGoal(req.user.id, req.params.goalId);
    return success(res, null, "Career goal removed");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getStrengths = async (req, res) => {
  try {
    const strengths = await profileService.getStrengths(req.user.id);
    return success(res, strengths, "Strengths fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addStrength = async (req, res) => {
  try {
    const strength = await profileService.addStrength(req.user.id, req.body);
    return success(res, strength, "Strength added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeStrength = async (req, res) => {
  try {
    await profileService.removeStrength(req.user.id, req.params.strengthId);
    return success(res, null, "Strength removed");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getWeaknesses = async (req, res) => {
  try {
    const weaknesses = await profileService.getWeaknesses(req.user.id);
    return success(res, weaknesses, "Weaknesses fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addWeakness = async (req, res) => {
  try {
    const weakness = await profileService.addWeakness(req.user.id, req.body);
    return success(res, weakness, "Weakness added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeWeakness = async (req, res) => {
  try {
    await profileService.removeWeakness(req.user.id, req.params.weaknessId);
    return success(res, null, "Weakness removed");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await profileService.getSkills(req.user.id);
    return success(res, skills, "Skills fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addSkill = async (req, res) => {
  try {
    const skill = await profileService.addSkill(req.user.id, req.body);
    return success(res, skill, "Skill added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeSkill = async (req, res) => {
  try {
    await profileService.removeSkill(req.user.id, req.params.skillId);
    return success(res, null, "Skill removed");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getCertifications = async (req, res) => {
  try {
    const certs = await profileService.getCertifications(req.user.id);
    return success(res, certs, "Certifications fetched successfully");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const addCertification = async (req, res) => {
  try {
    const cert = await profileService.addCertification(req.user.id, req.body);
    return success(res, cert, "Certification added", 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const updateCertification = async (req, res) => {
  try {
    const cert = await profileService.updateCertification(
      req.user.id,
      req.params.certId,
      req.body
    );
    return success(res, cert, "Certification updated");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const removeCertification = async (req, res) => {
  try {
    await profileService.removeCertification(req.user.id, req.params.certId);
    return success(res, null, "Certification removed");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const searchSkills = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return error(res, "Search query is required", 400);
    }
    const skills = await profileService.searchSkills(q);
    return success(res, skills, "Skills found");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const calculateProfileCompletion = async (req, res) => {
  try {
    const result = await profileService.calculateProfileCompletion(req.user.id);
    return success(res, result, "Profile completion calculated");
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
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
