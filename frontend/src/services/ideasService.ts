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
  return response.data.idea;
};

export const getMyIdeas = async (token: string) => {
  const response = await api.get("/my-ideas/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getIdeaById = async (id: number, token: string) => {
  const response = await api.get(`/ideas/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
