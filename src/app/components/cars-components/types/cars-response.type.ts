export type carsResponse = {
  car_id: number;
  name: string;
  brand: string;
  license_plate: string;
  year: string;
  rental_price: number;
  category: {
    category_id: number;
    name: string;
  };
};

export type carModal = {
  model: string;
  category: string;
  price: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
};

export type CarListResponse = {
  rental_id: number,
  customer_fk: number,
  car_fk: number,
  rental_days: number,
  start_date: string,
  end_date: string,
  total_price: number,
  status: boolean,
  car: {
    name: string,
    brand: string,
    rental_price: number,
    category: {
      category_id: number,
      name: string
    }
  }
};
