import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import axiosInstance from "axios";


/**
 * Fetches all blog tags from the API
 * @returns {Promise<BlogTag[]>} Array of blog tags
 */
export async function getTags() {
  try {
    const res: ApiResponse = await createApi().get('/blog-tag');
    if (!res?.data) {
      return [];
    }
    return res.data;
   
  } catch (error) {
     if (axiosInstance.isAxiosError(error)) {
        console.error(error);
        console.error(
          `Error when update blog: ${error.response?.data.errorCode}`
        );
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    return [];
  }
}