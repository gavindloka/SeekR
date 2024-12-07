export interface User {
    name: string;
    age: number;
    email: string;
    password: string;
    phone: string;
    role:string;
    companyName?:string;
    [key: string]: any;
  }
  