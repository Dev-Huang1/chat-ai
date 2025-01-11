// globals.d.ts
import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: typeof mongoose;
    }
  }
}

export {};
