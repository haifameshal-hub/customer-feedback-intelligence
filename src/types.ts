export type Sentiment = 'إيجابي' | 'سلبي' | 'محايد';
export type Priority = 'منخفضة' | 'متوسطة' | 'عالية';

export interface FeedbackAnalysis {
  id: string;
  comment: string;
  sentiment: Sentiment;
  category: string;
  mainIssue: string;
  priority: Priority;
  recommendation: string;
  timestamp: string;
  formattedText?: string;
}

export interface PresetSample {
  title: string;
  tag: string;
  text: string;
}
