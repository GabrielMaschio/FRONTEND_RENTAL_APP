export interface Rental {
  rental_id: number;
  rental_days: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
  status: boolean;
  customer: {
    customer_id: number;
    name: string;
    email: string;
    phone: string;
  };
  car: {
    car_id: number;
    name: string;
    brand: string;
    license_plate: string;
    year: string;
    rental_price: string;
    category: {
      category_id: number;
      name: string;
    };
  };
}

export interface CreateRental {
  customer_fk: number;
  car_fk: number;
  rental_days: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
}

export interface UpdateRental {
  rental_id: number;
  customer_fk: number;
  car_fk: number;
  rental_days: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
  status: boolean;
}
