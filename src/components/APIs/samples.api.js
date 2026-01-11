import http from "./http";

export const samplesAPI = {
  fetch: () =>
    http.get("/api/samples"),

  analyze: (data) =>
      http.post("/api/check-fraud", data)
};
