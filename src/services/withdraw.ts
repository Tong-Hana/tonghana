import { customFetch } from "@/lib/customFetch";

export const withdraw = async () => {
  const res = await customFetch<{ message: string }>("/delete-account", {
    method: "PATCH",
  });
  return res.message;
};
