export interface IUser {
  name: string;
  id: number;
  hasVoted?: boolean;
  vote?: string;
}