import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteItem = {
  id: number;
  title: string;
  price: number;
  image: string;
};

type FavoritesState = {
  items: FavoriteItem[];
  add: (item: FavoriteItem) => void;
  remove: (id: number) => void;
  toggle: (item: FavoriteItem) => void;
  isFavorite: (id: number) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) return;
        set({ items: [...get().items, item] });
      },
      remove: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      toggle: (item) => {
        const isFav = get().items.some((i) => i.id === item.id);
        if (isFav) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      isFavorite: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: "favorites-store" }
  )
);

export default useFavorites;


