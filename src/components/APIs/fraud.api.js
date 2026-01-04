import http from "./http";

export const fraudAPI = {
  check: (data) =>
    http.post("/api/check-fraud", data)
};
