const handleFetch = async (
  url,
  options = {}
) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message,
    };
  }
};

export const fetchConversations =
  async () => {
    return handleFetch('/api/conversations');
  };

export const fetchMessages = async (
  conversationId
) => {
  return handleFetch(
    `/api/conversations/${conversationId}/messages`
  );
};

export const sendMessage = async (
  conversationId,
  content
) => {
  return handleFetch(
    `/api/conversations/${conversationId}/messages`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        content,
      }),
    }
  );
};