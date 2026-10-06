# Customer Feedback Intelligence

An AI-powered customer feedback analysis and decision-support application that transforms unstructured customer comments into structured, actionable business insights using the Gemini API.

## Overview

Customer Feedback Intelligence helps organizations analyze customer feedback efficiently and convert qualitative comments into insights that can support customer experience and business decisions.

Instead of manually reviewing large volumes of feedback, the application uses AI to identify sentiment, classify feedback, detect the main issue, assign a priority level, and generate an actionable recommendation.

The application supports both Arabic and English customer feedback through a modern Arabic RTL interface.

## Business Problem

Organizations receive customer feedback from multiple channels, but manually reviewing and categorizing large volumes of comments can be time-consuming and inconsistent.

This can make it difficult to:

- Identify recurring customer issues.
- Detect high-priority problems quickly.
- Understand overall customer sentiment.
- Convert feedback into actionable recommendations.
- Support data-driven customer experience decisions.

## Solution

Customer Feedback Intelligence provides an AI-powered workflow that converts customer comments into structured analytical outputs.

For each customer comment, the system generates:

| Output | Description |
|---|---|
| Sentiment | Identifies the feedback as Positive, Neutral, or Negative |
| Category | Classifies the feedback into the appropriate business category |
| Main Issue | Extracts the primary issue or concern |
| Priority | Assigns High, Medium, or Low priority |
| Recommendation | Generates an actionable recommendation for improvement |

## Key Features

- AI-powered customer feedback analysis
- Sentiment analysis
- Automatic feedback categorization
- Main issue identification
- Priority classification
- Actionable business recommendations
- Single comment analysis
- Batch feedback analysis
- Interactive analytics dashboard
- Feedback history and reporting
- Filtering and search
- CSV export
- Arabic RTL user interface
- Responsive web design

## How It Works

Customer Feedback  
→ AI Analysis  
→ Sentiment Classification  
→ Category Identification  
→ Main Issue Detection  
→ Priority Assessment  
→ Actionable Recommendation  
→ Dashboard & Reporting

## Dashboard & Analytics

The dashboard provides a summarized view of analyzed customer feedback, including:

- Total analyzed feedback
- Sentiment distribution
- Critical and high-priority issues
- Most common feedback categories
- Feedback history
- Business-oriented recommendations

These insights help transform individual customer comments into information that can support decision-making and service improvement.

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express

**AI**
- Google Gemini API
- Google GenAI SDK

**Deployment**
- Render

**Version Control**
- Git
- GitHub

## Live Demo

The application is deployed and available online:

https://customer-feedback-intelligence-hdqr.onrender.com

> Note: The application is hosted on a free Render instance. The first request after a period of inactivity may take several seconds while the service starts.

## Example

### Customer Feedback

> الخدمة بشكل عام ممتازة والتطبيق سهل الاستخدام، لكن واجهت تأخيرًا في تأكيد الطلب ولم تصلني إشعارات توضح حالة الطلب.

### AI Analysis

**Sentiment:** Positive  
**Category:** Digital Application & Platform  
**Priority:** Medium  
**Main Issue:** Issue in the order completion/status tracking experience  
**Recommendation:** Improve order-status updates and provide timely notifications to enhance the customer experience.

## Business Value

The project demonstrates how artificial intelligence can support customer experience management by transforming unstructured feedback into structured insights.

Potential business benefits include:

- Faster feedback analysis
- Early identification of customer pain points
- More consistent feedback classification
- Better prioritization of issues
- Improved decision support
- Actionable recommendations for service improvement

## Project Perspective

This project combines concepts from:

- Business Analysis
- Data Analysis
- Artificial Intelligence
- Customer Experience (CX)
- Decision Support
- UI/UX Design

The focus is not only on analyzing text, but on translating customer feedback into insights that can support practical business decisions.

## Security

The Gemini API key is stored securely as an environment variable and is not included in the source code or repository.

Environment variable required:

`GEMINI_API_KEY`

## Future Improvements

Future versions may include:

- Advanced trend analysis
- Additional dashboard visualizations
- Automated executive summaries
- Multi-source customer feedback integration
- Advanced filtering and reporting
- Improved recommendation logic based on priority level
- Expanded Arabic NLP capabilities

## Author

**Haifa Alharbi**

Information Science | Business Analysis | Data Analysis | AI & Customer Experience

LinkedIn: https://www.linkedin.com/in/haifa-alharbi-
