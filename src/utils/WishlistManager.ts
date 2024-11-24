// src/utils/WishlistManager.ts
import { Movie } from '@/types/movie';

export class WishlistManager {
    private wishlist: Movie[] = [];

    constructor(private userId: string) {
        this.loadWishlist();
    }

    toggleWishlist(movie: Movie): void {
        const index = this.wishlist.findIndex((item) => item.id === movie.id);
        if (index === -1) {
            this.wishlist.push(movie);
        } else {
            this.wishlist.splice(index, 1);
        }
        this.saveWishlist();
    }

    getWishlist(): Movie[] {
        return this.wishlist;
    }

    private saveWishlist(): void {
        localStorage.setItem(`wishlist_${this.userId}`, JSON.stringify(this.wishlist));
    }

    private loadWishlist(): void {
        const data = localStorage.getItem(`wishlist_${this.userId}`);
        if (data) {
            this.wishlist = JSON.parse(data);
        }
    }
}
