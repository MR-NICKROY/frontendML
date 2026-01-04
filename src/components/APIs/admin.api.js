import http from "./http";

export const adminAPI = {
  addTransaction: (data) =>
    http.post("/api/admin/transactions", data),

  deleteTransaction: (id) =>
    http.delete(`/api/admin/transactions/${id}`),

  allTransactions: () =>
    http.get("/api/admin/all-transactions"),

  auditLogs: () =>
    http.get("/api/admin/audit-logs")
};
