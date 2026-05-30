import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "../../services/profileService";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAcademicRecord = createAsyncThunk(
  "profile/addAcademicRecord",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addAcademicRecord(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAcademicRecord = createAsyncThunk(
  "profile/updateAcademicRecord",
  async ({ recordId, data }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateAcademicRecord(recordId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAcademicRecord = createAsyncThunk(
  "profile/deleteAcademicRecord",
  async (recordId, { rejectWithValue }) => {
    try {
      await profileService.deleteAcademicRecord(recordId);
      return recordId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSubjectMark = createAsyncThunk(
  "profile/addSubjectMark",
  async ({ recordId, data }, { rejectWithValue }) => {
    try {
      const response = await profileService.addSubjectMark(recordId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubjectMark = createAsyncThunk(
  "profile/deleteSubjectMark",
  async (markId, { rejectWithValue }) => {
    try {
      await profileService.deleteSubjectMark(markId);
      return markId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInterests = createAsyncThunk(
  "profile/fetchInterests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getInterests();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addInterest = createAsyncThunk(
  "profile/addInterest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addInterest(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeInterest = createAsyncThunk(
  "profile/removeInterest",
  async (interestId, { rejectWithValue }) => {
    try {
      await profileService.removeInterest(interestId);
      return interestId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCareerGoals = createAsyncThunk(
  "profile/fetchCareerGoals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getCareerGoals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCareerGoal = createAsyncThunk(
  "profile/addCareerGoal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addCareerGoal(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCareerGoal = createAsyncThunk(
  "profile/updateCareerGoal",
  async ({ goalId, data }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateCareerGoal(goalId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCareerGoal = createAsyncThunk(
  "profile/removeCareerGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      await profileService.removeCareerGoal(goalId);
      return goalId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStrengths = createAsyncThunk(
  "profile/fetchStrengths",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getStrengths();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addStrength = createAsyncThunk(
  "profile/addStrength",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addStrength(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeStrength = createAsyncThunk(
  "profile/removeStrength",
  async (strengthId, { rejectWithValue }) => {
    try {
      await profileService.removeStrength(strengthId);
      return strengthId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeaknesses = createAsyncThunk(
  "profile/fetchWeaknesses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getWeaknesses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addWeakness = createAsyncThunk(
  "profile/addWeakness",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addWeakness(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeWeakness = createAsyncThunk(
  "profile/removeWeakness",
  async (weaknessId, { rejectWithValue }) => {
    try {
      await profileService.removeWeakness(weaknessId);
      return weaknessId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSkills = createAsyncThunk(
  "profile/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getSkills();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSkill = createAsyncThunk(
  "profile/addSkill",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addSkill(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeSkill = createAsyncThunk(
  "profile/removeSkill",
  async (skillId, { rejectWithValue }) => {
    try {
      await profileService.removeSkill(skillId);
      return skillId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSkills = createAsyncThunk(
  "profile/searchSkills",
  async (query, { rejectWithValue }) => {
    try {
      const response = await profileService.searchSkills(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCertifications = createAsyncThunk(
  "profile/fetchCertifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getCertifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCertification = createAsyncThunk(
  "profile/addCertification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await profileService.addCertification(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCertification = createAsyncThunk(
  "profile/updateCertification",
  async ({ certId, data }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateCertification(certId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCertification = createAsyncThunk(
  "profile/removeCertification",
  async (certId, { rejectWithValue }) => {
    try {
      await profileService.removeCertification(certId);
      return certId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  academicRecords: [],
  interests: [],
  careerGoals: [],
  strengths: [],
  weaknesses: [],
  skills: [],
  certifications: [],
  completionPct: 0,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.academicRecords = [];
      state.interests = [];
      state.careerGoals = [];
      state.strengths = [];
      state.weaknesses = [];
      state.skills = [];
      state.certifications = [];
      state.completionPct = 0;
      state.error = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.academicRecords = action.payload?.academicRecords || [];
        state.interests = action.payload?.interests || [];
        state.careerGoals = action.payload?.careerGoals || [];
        state.strengths = action.payload?.strengths || [];
        state.weaknesses = action.payload?.weaknesses || [];
        state.skills = action.payload?.skills || [];
        state.certifications = action.payload?.certifications || [];
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAcademicRecord.fulfilled, (state, action) => {
        state.academicRecords.push(action.payload);
      })
      .addCase(updateAcademicRecord.fulfilled, (state, action) => {
        const index = state.academicRecords.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) state.academicRecords[index] = action.payload;
      })
      .addCase(deleteAcademicRecord.fulfilled, (state, action) => {
        state.academicRecords = state.academicRecords.filter(
          (r) => r.id !== action.payload
        );
      })
      .addCase(addSubjectMark.fulfilled, (state, action) => {
        const record = state.academicRecords.find(
          (r) => r.id === action.payload.recordId
        );
        if (record) {
          if (!record.marks) record.marks = [];
          record.marks.push(action.payload);
        }
      })
      .addCase(deleteSubjectMark.fulfilled, (state, action) => {
        state.academicRecords.forEach((record) => {
          if (record.marks) {
            record.marks = record.marks.filter((m) => m.id !== action.payload);
          }
        });
      })

      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.interests = action.payload;
      })
      .addCase(addInterest.fulfilled, (state, action) => {
        state.interests.push(action.payload);
      })
      .addCase(removeInterest.fulfilled, (state, action) => {
        state.interests = state.interests.filter(
          (i) => i.id !== action.payload
        );
      })

      .addCase(fetchCareerGoals.fulfilled, (state, action) => {
        state.careerGoals = action.payload;
      })
      .addCase(addCareerGoal.fulfilled, (state, action) => {
        state.careerGoals.push(action.payload);
      })
      .addCase(updateCareerGoal.fulfilled, (state, action) => {
        const index = state.careerGoals.findIndex(
          (g) => g.id === action.payload.id
        );
        if (index !== -1) state.careerGoals[index] = action.payload;
      })
      .addCase(removeCareerGoal.fulfilled, (state, action) => {
        state.careerGoals = state.careerGoals.filter(
          (g) => g.id !== action.payload
        );
      })

      .addCase(fetchStrengths.fulfilled, (state, action) => {
        state.strengths = action.payload;
      })
      .addCase(addStrength.fulfilled, (state, action) => {
        state.strengths.push(action.payload);
      })
      .addCase(removeStrength.fulfilled, (state, action) => {
        state.strengths = state.strengths.filter(
          (s) => s.id !== action.payload
        );
      })

      .addCase(fetchWeaknesses.fulfilled, (state, action) => {
        state.weaknesses = action.payload;
      })
      .addCase(addWeakness.fulfilled, (state, action) => {
        state.weaknesses.push(action.payload);
      })
      .addCase(removeWeakness.fulfilled, (state, action) => {
        state.weaknesses = state.weaknesses.filter(
          (w) => w.id !== action.payload
        );
      })

      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
      })
      .addCase(removeSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter((s) => s.id !== action.payload);
      })

      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.certifications = action.payload;
      })
      .addCase(addCertification.fulfilled, (state, action) => {
        state.certifications.push(action.payload);
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        const index = state.certifications.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) state.certifications[index] = action.payload;
      })
      .addCase(removeCertification.fulfilled, (state, action) => {
        state.certifications = state.certifications.filter(
          (c) => c.id !== action.payload
        );
      });
  },
});

export const { clearProfile, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
