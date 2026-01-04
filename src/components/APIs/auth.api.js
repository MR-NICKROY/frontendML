import http from "./http";

export const authAPI = {
  signup: (data) =>
    http.post("/api/auth/signup", data),

  login: (data) =>
    http.post("/api/auth/login", data),

  logout: () =>
    http.post("/api/auth/logout"),

  me: () =>
    http.get("/api/auth/me")
};

