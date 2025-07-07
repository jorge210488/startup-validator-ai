// services/ideaService.ts
import api from "./api";

export const submitIdea = async (originalText: string, token: string) => {
  const response = await api.post(
    "/submit-idea/",
    { original_text: originalText },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.idea; // ✅ devolvemos solo la idea
};

export const getMyIdeas = async (token: string) => {
  const response = await api.get("/my-ideas/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // ← esto será un array
};
