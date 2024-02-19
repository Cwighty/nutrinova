export interface Patient {
  id?: string;
  firstname: string;
  lastname?: string;
  customerId?: string;
  age?: number;
  sex?: 'M' | 'F' | 'O';
  base64image?: string; // only used for upload need use the patient image hook to get the image
}