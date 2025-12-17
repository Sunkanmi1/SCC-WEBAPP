import "express-session";

declare module "express-session" {
	interface SessionData {
		recentSearches?: { query: string; timestamp: number }[];
	}
}
