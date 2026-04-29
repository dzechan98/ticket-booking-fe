export const RATING_KEYS = {
  all: ["ratings"] as const,
  byMovie: (movieId: string) => ["ratings", "movie", movieId] as const,
};
