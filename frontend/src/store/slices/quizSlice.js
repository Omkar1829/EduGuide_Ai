import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import quizService from "../../services/quizService";

export const fetchQuizzes = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizzes(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  "quizzes/createQuiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await quizService.createQuiz(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateAIQuiz = createAsyncThunk(
  "quizzes/generateAIQuiz",
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizService.generateAIQuiz();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchQuizById = createAsyncThunk(
  "quizzes/fetchQuizById",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizById(quizId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  "quizzes/submitQuizAnswers",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const response = await quizService.submitQuiz(quizId, answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuizResults = createAsyncThunk(
  "quizzes/fetchQuizResults",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizResults(quizId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserResults = createAsyncThunk(
  "quizzes/fetchUserResults",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await quizService.getUserResults(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quizzes: [],
  currentQuiz: null,
  quizResults: [],
  currentResult: null,
  userResults: [],
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    clearQuizzes: (state) => {
      state.quizzes = [];
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearQuizResults: (state) => {
      state.quizResults = [];
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    clearUserResults: (state) => {
      state.userResults = [];
    },
    clearQuizError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload?.quizzes || action.payload || [];
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(generateAIQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAIQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.unshift(action.payload);
      })
      .addCase(generateAIQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload;
        state.quizResults.push(action.payload);
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload;
        state.quizResults = action.payload || [];
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserResults.fulfilled, (state, action) => {
        state.loading = false;
        state.userResults = action.payload?.results || action.payload || [];
      })
      .addCase(fetchUserResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuizzes, clearCurrentQuiz, clearQuizResults, clearCurrentResult, clearUserResults, clearQuizError } =
  quizSlice.actions;
export default quizSlice.reducer;
