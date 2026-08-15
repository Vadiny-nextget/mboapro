export interface ChatSuggestedService {
  title: string;
  slug: string;
  price: number;
  price_unit: string;
  city: string;
  rating: number;
  first_name: string;
  last_name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestedServices?: ChatSuggestedService[];
}