// interfaces/news.ts

export interface RelatedArticle {
  text: string;
  imageSrc: string;
  slug: string;
}

export interface NewsArticle {
  _id: string;
  title: string;
  imageSrc: string;
  text: string;
  tag: string;
  slug: string;
  category: string;
  videoSrc: string | null;
  listItems: string[];
  relatedArticles: RelatedArticle[];
  createdAt: string;
  updatedAt: string;
}
