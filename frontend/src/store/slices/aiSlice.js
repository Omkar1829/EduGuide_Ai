import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import aiService from "../../services/aiService";
import { setUser } from "./authSlice";

export const fetchCareerRecommendation = createAsyncThunk(
  "ai/fetchCareerRecommendation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getCareerRecommendation();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStreamRecommendation = createAsyncThunk(
  "ai/fetchStreamRecommendation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getStreamRecommendation();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSkillGap = createAsyncThunk(
  "ai/fetchSkillGap",
  async (targetCareer, { rejectWithValue }) => {
    try {
      const response = await aiService.analyzeSkillGap(targetCareer);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoadmap = createAsyncThunk(
  "ai/fetchRoadmap",
  async (targetCareer, { rejectWithValue }) => {
    try {
      const response = await aiService.generateRoadmap(targetCareer);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "ai/sendChatMessage",
  async ({ message, sessionId, history }, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await aiService.sendMessage(message, sessionId, history);
      
      // If the response contains chatLimitRemaining, update the auth user state!
      if (response?.data?.chatLimitRemaining !== undefined) {
        const { user } = getState().auth;
        if (user) {
          dispatch(setUser({
            ...user,
            chatLimitRemaining: response.data.chatLimitRemaining
          }));
        }
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResumeAnalysis = createAsyncThunk(
  "ai/fetchResumeAnalysis",
  async (resumeContent, { rejectWithValue }) => {
    try {
      const response = await aiService.analyzeResume(resumeContent);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFutureSimulation = createAsyncThunk(
  "ai/fetchFutureSimulation",
  async ({ paths, timeline }, { rejectWithValue }) => {
    try {
      const response = await aiService.simulateFuture(paths, timeline);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuizAnalysis = createAsyncThunk(
  "ai/fetchQuizAnalysis",
  async ({ quizId, resultId }, { rejectWithValue }) => {
    try {
      const response = await aiService.analyzeQuiz(quizId, resultId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseRecommendations = createAsyncThunk(
  "ai/fetchCourseRecommendations",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await aiService.recommendCourses(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobMatches = createAsyncThunk(
  "ai/fetchJobMatches",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await aiService.matchJobs(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  careerRecommendations: [],
  streamRecommendations: [],
  skillGap: null,
  roadmap: null,
  chatMessages: [],
  chatSessionId: null,
  resumeAnalysis: null,
  simulation: null,
  quizAnalysis: null,
  courseRecommendations: [],
  jobMatches: [],
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    clearChat: (state) => {
      state.chatMessages = [];
      state.chatSessionId = null;
    },
    setCurrentSession: (state, action) => {
      state.chatSessionId = action.payload;
    },
    clearAiError: (state) => {
      state.error = null;
    },
    clearResumeAnalysis: (state) => {
      state.resumeAnalysis = null;
    },
    resetAiState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareerRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareerRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.careerRecommendations =
          action.payload?.recommendations || action.payload || [];
      })
      .addCase(fetchCareerRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStreamRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStreamRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.streamRecommendations =
          action.payload?.recommendations || action.payload || [];
      })
      .addCase(fetchStreamRecommendation.rejected, (state, action) => {
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
        state.roadmap = action.payload;
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendChatMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const payload = action.payload;
        const chatData = payload?.data || payload;
        if (chatData?.sessionId) {
          state.chatSessionId = chatData.sessionId;
        }
        if (chatData?.message) {
          state.chatMessages.push({
            id: chatData.id || Date.now(),
            role: "assistant",
            content: chatData.message,
            timestamp: chatData.timestamp || new Date().toISOString(),
          });
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
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
      })

      .addCase(fetchFutureSimulation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFutureSimulation.fulfilled, (state, action) => {
        state.loading = false;
        state.simulation = action.payload;
      })
      .addCase(fetchFutureSimulation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchQuizAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.quizAnalysis = action.payload;
      })
      .addCase(fetchQuizAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCourseRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.courseRecommendations =
          action.payload?.courses || action.payload || [];
      })
      .addCase(fetchCourseRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJobMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.jobMatches = action.payload?.jobs || action.payload || [];
      })
      .addCase(fetchJobMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  clearChat,
  setCurrentSession,
  clearAiError,
  clearResumeAnalysis,
  resetAiState,
} = aiSlice.actions;

export default aiSlice.reducer;
