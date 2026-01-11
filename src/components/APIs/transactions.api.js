import http from "./http";

export const transactionsAPI = {
  addManual: (data) =>
    http.post("/api/check-fraud", data)

};
