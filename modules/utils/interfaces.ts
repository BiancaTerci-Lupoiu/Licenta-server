export interface EmailOptions {
  email: string;
  message: string;
  subject: string;
}

export interface FilterByPictureResponse {
  pictures: string[];
  percentages: number[];
}
