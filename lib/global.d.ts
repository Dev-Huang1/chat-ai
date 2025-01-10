import { Mongoose } from 'mongoose';

declare global {
  let mongoose: {
    conn: any;
    promise: any;
  };
}

export {};
