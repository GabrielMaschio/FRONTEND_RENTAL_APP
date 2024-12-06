export interface RentalRequest {
  car_fk: number;
  customer_fk: number;
  rental_days: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: boolean;
}
