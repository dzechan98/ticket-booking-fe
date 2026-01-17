import axios from "axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(
    process.env.NEXT_PUBLIC_IMAGE_URL || "",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (response.status !== 200) {
    throw new Error("Image upload failed");
  }

  return response.data.data.display_url as string;
};
