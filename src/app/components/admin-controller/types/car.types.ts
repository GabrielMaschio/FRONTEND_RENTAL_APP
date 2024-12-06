export interface Car {
  car_id: string;
  name: string;
  brand: string;
  year: string;
  license_plate: string;
  rental_price: number;
  category: {
    category_id: string;
    name: string;
  };
}

export interface CreateCar {
  name: string;
  brand: string;
  license_plate: string;
  year: string;
  rental_price: number;
  category_fk: number;
}

export interface UpdateCar {
  name: string;
  brand: string;
  license_plate: string;
  year: string;
  rental_price: number;
  category_fk: number;
}
