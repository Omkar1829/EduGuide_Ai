import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import courseReducer from "./slices/courseSlice";
import jobReducer from "./slices/jobSlice";
import recommendationReducer from "./slices/recommendationSlice";
import quizReducer from "./slices/quizSlice";
import notificationReducer from "./slices/notificationSlice";
import aiDashboardReducer from "./slices/aiDashboardSlice";
import adminReducer from "./slices/adminSlice";
import aiReducer from "./slices/aiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    courses: courseReducer,
    jobs: jobReducer,
    recommendations: recommendationReducer,
    quizzes: quizReducer,
    notifications: notificationReducer,
    aiDashboard: aiDashboardReducer,
    admin: adminReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});

export { store };
export default store;
