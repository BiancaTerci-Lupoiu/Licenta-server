import axios from "axios";
import { config } from "../../config";

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

export const filterPicturesByPicture: (pictureName: string) => Promise<{
  pictures: string[];
}> = async (pictureName: string) => {
  try {
    const response = await axios.get(
      `${config.urlFiltersServer}/pictures/${pictureName}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
