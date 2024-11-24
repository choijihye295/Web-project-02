// src/utils/WishlistManager.ts
import { Movie } from '@/types/movie';

export class WishlistManager {
    private userId: string;
    private storageKey: string;

    constructor(userId: string) {
        this.userId = userId;
        this.storageKey = 'movieWishlist';
    }

    // 로컬 스토리지에서 현재 사용자에 대한 찜 리스트 가져오기
    private loadWishlist(): Movie[] {
        const allWishlists = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        return allWishlists[this.userId] || [];
    }

    // 현재 사용자에 대한 찜 리스트 저장
    private saveWishlist(wishlist: Movie[]): void {
        const allWishlists = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        allWishlists[this.userId] = wishlist;
        localStorage.setItem(this.storageKey, JSON.stringify(allWishlists));
    }

    // 찜 리스트 가져오기
    public getWishlist(): Movie[] {
        return this.loadWishlist();
    }

    // 찜 토글 (추가/제거)
    public toggleWishlist(movie: Movie): void {
        const wishlist = this.loadWishlist();
        const index = wishlist.findIndex((item) => item.id === movie.id);

        if (index === -1) {
            wishlist.push(movie);
        } else {
            wishlist.splice(index, 1);
        }

        this.saveWishlist(wishlist);
    }
}
