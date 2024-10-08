export interface BlogPost {
    id: string;
    title: string;
    content: string;
    publishedAt: string;
    category: Category;  // この行を追加
}

export interface Category {
    id: string;
    name: string;
}
