import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import aiDashboardService from "../../services/aiDashboardService";

export const fetchCareerScore = createAsyncThunk(
  "aiDashboard/fetchCareerScore",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.getCareerScore();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecommendedStreams = createAsyncThunk(
  "aiDashboard/fetchRecommendedStreams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.getRecommendedStreams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCareerRecommendations = createAsyncThunk(
  "aiDashboard/fetchCareerRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.getCareerRecommendations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateRecommendationsThunk = createAsyncThunk(
  "aiDashboard/generateRecommendationsThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.generateRecommendations();
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Failed to generate recommendations";
      return rejectWithValue(errMsg);
    }
  }
);

export const fetchSkillGap = createAsyncThunk(
  "aiDashboard/fetchSkillGap",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.getSkillGap();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoadmap = createAsyncThunk(
  "aiDashboard/fetchRoadmap",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.getRoadmaps();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveRoadmap = createAsyncThunk(
  "aiDashboard/saveRoadmap",
  async (data, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.createRoadmap(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  "aiDashboard/fetchChatHistory",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.getChatHistory(sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "aiDashboard/sendMessage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.sendMessage(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResumeAnalysis = createAsyncThunk(
  "aiDashboard/fetchResumeAnalysis",
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await aiDashboardService.analyzeResume(resumeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  careerScore: null,
  recommendedStreams: [],
  careerRecommendations: [],
  skillGap: null,
  roadmap: [],
  chatHistory: [],
  resumeAnalysis: null,
  loading: false,
  error: null,
};

const aiDashboardSlice = createSlice({
  name: "aiDashboard",
  initialState,
  reducers: {
    clearAiDashboard: (state) => {
      state.careerScore = null;
      state.recommendedStreams = [];
      state.careerRecommendations = [];
      state.skillGap = null;
      state.roadmap = [];
      state.chatHistory = [];
      state.resumeAnalysis = null;
      state.error = null;
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
    clearAiDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareerScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareerScore.fulfilled, (state, action) => {
        state.loading = false;
        state.careerScore = action.payload;
      })
      .addCase(fetchCareerScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRecommendedStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedStreams.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedStreams =
          action.payload?.recommendations || action.payload || [];
      })
      .addCase(fetchRecommendedStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCareerRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareerRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.careerRecommendations =
          action.payload?.recommendations || action.payload || [];
      })
      .addCase(fetchCareerRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(generateRecommendationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRecommendationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const list = action.payload?.data || action.payload?.recommendations || action.payload || [];
        state.careerRecommendations = list;
      })
      .addCase(generateRecommendationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSkillGap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkillGap.fulfilled, (state, action) => {
        state.loading = false;
        state.skillGap = action.payload;
      })
      .addCase(fetchSkillGap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap = action.payload?.roadmaps || action.payload || [];
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap.push(action.payload);
      })
      .addCase(saveRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory =
          action.payload?.messages || action.payload || [];
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.chatHistory.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchResumeAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeAnalysis = action.payload;
      })
      .addCase(fetchResumeAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAiDashboard,
  clearChatHistory,
  clearAiDashboardError,
} = aiDashboardSlice.actions;
export default aiDashboardSlice.reducer;
