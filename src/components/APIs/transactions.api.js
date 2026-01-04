import http from "./http";

export const transactionsAPI = {
  addManual: (data) =>
    http.post("/api/transactions/manual", data),

  myHistory: () =>
    http.get("/api/transactions/my")
};
