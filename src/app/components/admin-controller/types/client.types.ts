export interface Cliente {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface CreateClient {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateClient {
  name: string;
  email: string;
  phone: string;
}
