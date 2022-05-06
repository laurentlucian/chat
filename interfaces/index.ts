// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type Message = {
  id: number;
  userId: string;
  name: string;
  time: Date;
  body: string;
  user: User;
};

export type User = {
  id: string;
  name: string;
};

export type Room = {
  id: number;
};
