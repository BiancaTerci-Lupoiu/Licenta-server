import axios from "axios";
import { config } from "../../config";
import { FilterByPictureResponse } from "./interfaces";

export const savePictureFeatures = async (pictureName: string) => {
  try {
    const response = await axios.post(`${config.urlFiltersServer}/pictures/`, {
      pictureName,
    });
    return response.status;
  } catch (error) {
    return null;
  }
};

export const filterImagesByPicture: (
  pictureName: string
) => Promise<FilterByPictureResponse> = async (pictureName: string) => {
  try {
    const response = await axios.get(
      `${config.urlFiltersServer}/pictures/${pictureName}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
