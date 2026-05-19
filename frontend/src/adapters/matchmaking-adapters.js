const handleFetch = async (url) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
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

export const fetchFilteredEvents = async (
  game,
  minigameType
) => {
  const params = new URLSearchParams();

  if (game) {
    params.append('game', game);
  }

  if (minigameType) {
    params.append(
      'minigame_type',
      minigameType
    );
  }

  return handleFetch(
    `/api/events?${params.toString()}`
  );
};

export const fetchRecommendedEvents =
  async () => {
    return handleFetch(
      '/api/matchmaking/recommended'
    );
  };