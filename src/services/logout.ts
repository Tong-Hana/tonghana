import { customFetch } from "@/lib/customFetch";

export const logout = async () => {
  const res = await customFetch<{ message: string }>("/logout", {
    method: "POST",
  });
  return res.message;
};
