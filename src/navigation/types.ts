import { NewsArticle } from '~/types/news';

export type RootStackParamList = {
  TabNavigator: undefined;
  NewsDetail: {
    article: NewsArticle;
  };
};
