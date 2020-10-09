declare namespace Express {
  export interface Request {
    userId: number | string;
    userRole: string;
    io: any;
  }
}
