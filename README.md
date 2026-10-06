# CX Insight

An AI-powered customer feedback intelligence platform that helps businesses analyze customer comments and transform them into structured, actionable insights.

## Problem

Organizations receive large volumes of customer feedback through different channels, making manual analysis time-consuming and inconsistent.

Important issues can be difficult to identify quickly, especially when feedback contains mixed sentiments or relates to different business areas.

CX Insight addresses this challenge by automatically analyzing customer feedback and highlighting the information that can support faster and more informed business decisions.

## Solution & How AI Works

CX Insight uses the Gemini API as a pre-trained generative AI model to analyze customer feedback in Arabic and English.

The user enters a customer comment, and the system processes the text using Gemini to generate structured insights.

### Input
Customer feedback or review in Arabic or English.

### Output
The system automatically identifies:

- Sentiment: Positive, Negative, or Neutral
- Category
- Main Issue
- Priority Level
- Actionable Recommendation

The platform also supports batch feedback analysis, analytics dashboards, feedback history, filtering, and CSV export.

## Live Demo

CX Insight is deployed as a web application using Render:

https://customer-feedback-intelligence-hdqr.onrender.com

> Note: The application is hosted on a free Render instance, so the first request after a period of inactivity may take a few seconds to load.

## How to Run

1. Open the live application using the link above.
2. Enter a customer comment in Arabic or English.
3. Click the analysis button.
4. Review the generated sentiment, category, main issue, priority, and recommendation.
5. Use the batch analysis and dashboard features to analyze multiple customer comments and explore aggregated insights.

The Gemini API key is securely configured as an environment variable on the server and does not need to be entered by the user.

## Screenshots

Add 2–3 screenshots demonstrating the main features of CX Insight.

Recommended screenshots:

1. Main interface / landing page
2. Customer feedback analysis results
3. Analytics dashboard or batch analysis

## Project Limitations

CX Insight currently depends on AI-generated interpretations, so results may occasionally vary depending on the wording, context, or ambiguity of customer feedback.

Current limitations include:

- AI-generated classifications may not always perfectly reflect business-specific terminology.
- Complex or ambiguous feedback may require human review.
- The current version uses predefined analysis categories and priority criteria.
- The system currently relies on the Gemini API for AI processing.

### Future Improvements

Future development could include:

- Industry-specific classification models and categories
- More advanced analytics and visualizations
- Improved multilingual analysis
- Customizable business rules and priority criteria
- Integration with CRM and customer support platforms
- Advanced reporting and automated insight generation

## Project Owner

**Haifa Alharbi**

AI Project – Customer Experience Intelligence
