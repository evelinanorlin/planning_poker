export interface IUser {
  name: string;
  id: string;
  hasVoted?: boolean;
  vote?: number;
}