declare namespace Express {
  export interface Request {
    userId: number;
    userRole: string;
    io: any;
  }
}
