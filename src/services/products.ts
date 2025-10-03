import { supabase } from "@/utils/supabase";

export interface Product {
  id: number;
  name: string;
  category: "men" | "women";
  price: number;
  stock: number;
  description: string;
  image_url: string;
  created_at?: string;
}

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    console.log("error", error);
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  create: async (
    product: Omit<Product, "id" | "created_at">
  ): Promise<Product> => {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (
    id: number,
    product: Partial<Omit<Product, "id" | "created_at">>
  ): Promise<Product> => {
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  uploadImage: async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {});
    if (uploadError) throw new Error(`Upload ảnh lỗi: ${uploadError.message}`);

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return publicUrl;
  },
};
