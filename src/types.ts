export interface User {
	uid: string;
	email: string | null;
}

export interface AuthContextType {
	currentUser: User | null;
	signup: (email: string, password: string) => Promise<any>;
	login: (email: string, password: string) => Promise<any>;
	logout: () => Promise<void>;
}

export interface Todo {
	id: string;
	text: string;
	completed: boolean;
	userId: string;
	createdAt: any; // firestore timestamp
}

export type FilterType = 'all' | 'active' | 'completed';