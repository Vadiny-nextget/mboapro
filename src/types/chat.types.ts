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
  suggestedServices?: SuggestedService[];
  // suggestedServices?: ChatSuggestedService[];
}

export interface SuggestedService {
  id:                     string;
  provider_id:            string;
  category_id:            string;
  title:                  string;
  slug:                   string;
  description:            string;
  price:                  string;
  price_unit:             string;
  region:                 string;
  city:                   string;
  images:                 string[];
  availability:           string;
  rating:                 string;
  review_count:           number;
  is_published:           boolean;
  created_at:             string;
  updated_at:             string;
  category_suggestion_id: null;
  pending_skills:         string;
  category_title:         string;
  category_slug:          string;
  is_pending_category:    boolean;
  provider_user_id:       string;
  provider_email:         null;
  provider_phone:         string;
  first_name:             string;
  last_name:              string;
  avatar_url:             string;
  preferred_language:     string;
  provider_profile_id:    string;
  verification_status:    string;
  provider_city:          string;
  provider_whatsapp:      string;
  skill_list:             SkillList[];
}

export interface SkillList {
  id:   string;
  name: string;
}
