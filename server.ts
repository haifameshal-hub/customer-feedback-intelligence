import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: "إيجابي أو سلبي أو محايد فقط",
    },
    category: {
      type: Type.STRING,
      description: "تصنيف المشكلة أو الملاحظة باختصار (مثل: جودة المنتج، خدمة العملاء، سرعة التوصيل، التسعير، التطبيق، التغليف، الصيانة)",
    },
    mainIssue: {
      type: Type.STRING,
      description: "المشكلة الرئيسية أو الملاحظة المركزية بإيجاز ووضوح",
    },
    priority: {
      type: Type.STRING,
      description: "منخفضة أو متوسطة أو عالية فقط بناءً على خطورة الأثر التشغيلي ورضا العميل",
    },
    recommendation: {
      type: Type.STRING,
      description: "توصية عملية محددة وقابلة للتنفيذ الفوري لتحسين الخدمة أو دعم القرار",
    },
  },
  required: ["sentiment", "category", "mainIssue", "priority", "recommendation"],
};

// Helper: Heuristic Arabic feedback analyzer fallback when upstream API has 503/network spikes
function fallbackAnalyzeArabicFeedback(comment: string) {
  const text = comment.toLowerCase();

  // Sentiment detection
  const positiveWords = ['ممتاز', 'رائع', 'جميل', 'شكرا', 'شكراً', 'أشكر', 'احتراف', 'سريع', 'بطل', 'راضي', 'توصية', 'إشادة', 'ممتازة', 'رائعة', 'مبدع'];
  const negativeWords = ['سيء', 'سيئ', 'تأخر', 'تأخير', 'بارد', 'مكسور', 'تالف', 'خدوش', 'ممزق', 'لم يرد', 'لا أحد يرد', 'خصم', 'نصب', 'غالي', 'مرتفع', 'يعلق', 'يغلق', 'عطل', 'مشكلة', 'كارثة', 'غير راضي', 'غير شفاف', 'رفض'];

  let posScore = 0;
  let negScore = 0;
  positiveWords.forEach(w => { if (text.includes(w)) posScore += 1; });
  negativeWords.forEach(w => { if (text.includes(w)) negScore += 1.5; });

  let sentiment: 'إيجابي' | 'سلبي' | 'محايد' = 'محايد';
  if (negScore > posScore && negScore >= 1) {
    sentiment = 'سلبي';
  } else if (posScore > negScore && posScore >= 1) {
    sentiment = 'إيجابي';
  }

  // Category detection
  let category = 'تجربة العملاء العامة';
  let mainIssue = 'ملاحظة عامة حول تجربة الخدمة';
  let priority: 'منخفضة' | 'متوسطة' | 'عالية' = 'متوسطة';
  let recommendation = 'متابعة الملاحظة وتوثيقها في سجل الجودة';

  if (text.includes('شحن') || text.includes('توصيل') || text.includes('مندوب') || text.includes('شحنة') || text.includes('ساعة') || text.includes('أيام') || text.includes('بارد')) {
    category = 'الشحن والتوصيل واللوجستيات';
    if (sentiment === 'سلبي') {
      mainIssue = 'تأخر وصول الطلب عن الموعد المحدد أو سوء مناولة الشحنة';
      priority = 'عالية';
      recommendation = 'مراجعة اتفاقية مستوى الخدمة (SLA) مع شركة الشحن وتفعيل آلية تعويض للعميل';
    } else {
      mainIssue = 'سرعة ودقة التوصيل';
      priority = 'منخفضة';
      recommendation = 'تعميم معايير شركة التوصيل الملتزمة كنموذج لعمليات الشحن';
    }
  } else if (text.includes('تطبيق') || text.includes('تعليق') || text.includes('يغلق') || text.includes('ios') || text.includes('أندرويد') || text.includes('موقع') || text.includes('سلة') || text.includes('زر')) {
    category = 'التطبيق والمنصة الرقمية';
    mainIssue = 'خلل في واجهة المستخدم أو انقطاع في مسار إتمام الطلب';
    priority = sentiment === 'سلبي' ? 'عالية' : 'متوسطة';
    recommendation = 'إحالة سجلات الخطأ لفريق الهندسة البرمجية وإصدار تحديث تصحيحي عاجل';
  } else if (text.includes('سعر') || text.includes('رسوم') || text.includes('كوبون') || text.includes('خصم') || text.includes('فاتورة') || text.includes('فلوس') || text.includes('دفع') || text.includes('بطاقة') || text.includes('ريال')) {
    category = 'التسعير والفواتير والدفع';
    mainIssue = 'اعتراض على شفافية الرسوم أو تعثر وسيلة الدفع';
    priority = sentiment === 'سلبي' ? 'عالية' : 'متوسطة';
    recommendation = 'إبراز تفاصيل الرسوم والضرائب بشفافية تامة في سلة المشتريات قبل الدفع';
  } else if (text.includes('دعم') || text.includes('خدمة العملاء') || text.includes('واتساب') || text.includes('رد') || text.includes('تواصل') || text.includes('موظف') || text.includes('محادثة')) {
    category = 'خدمة العملاء والدعم الفني';
    if (sentiment === 'سلبي') {
      mainIssue = 'بطء استجابة قنوات الدعم وتجاهل استفسارات العميل';
      priority = 'عالية';
      recommendation = 'إعادة توزيع نوبات ممثلي خدمة العملاء ووضع حد أقصى لزمن الرد الأول (First Response Time)';
    } else {
      mainIssue = 'احترافية وسرعة استجابة ممثل الدعم';
      priority = 'منخفضة';
      recommendation = 'تكريم موظف الدعم وتضمين أسلوبه في دليل أفضل الممارسات التدريبية';
    }
  } else if (text.includes('جودة') || text.includes('قماش') || text.includes('خامة') || text.includes('مقاس') || text.includes('كسر') || text.includes('تالف') || text.includes('منتج') || text.includes('صور')) {
    category = 'جودة المنتج والمطابقة';
    mainIssue = 'عدم تطابق مواصفات المنتج المستلم مع الوصف المعروض أو وجود عيب مصنعي';
    priority = sentiment === 'سلبي' ? 'عالية' : 'منخفضة';
    recommendation = 'تحديث صور وأبعاد المنتج على المتجر وتدقيق فحص الجودة قبل التغليف';
  }

  return {
    sentiment,
    category,
    mainIssue,
    priority,
    recommendation,
  };
}

// Single comment analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return res.status(400).json({ error: 'يرجى تقديم تعليق العميل للتحليل' });
    }

    const ai = getGeminiClient();

    let parsed: any = null;

    if (ai) {
      const prompt = `أنت نظام ذكي لتحليل آراء العملاء.
حلل تعليق العميل التالي وأعطِ النتيجة باللغة العربية:
"${comment.trim()}"

شروط الإخراج:
- Sentiment: إيجابي أو سلبي أو محايد
- Category: تصنيف المشكلة أو الملاحظة بدقة
- Main Issue: المشكلة أو الفكرة الرئيسية بإيجاز
- Priority: منخفضة أو متوسطة أو عالية
- Recommendation: توصية عملية واضحة لاتخاذ قرار عملي لتحسين الخدمة وتفادي تكرار الخطأ أو استثمار الرضا.

اجعل التحليل موجزاً ودقيقاً ومناسباً لاتخاذ قرارات الأعمال.`;

      // Attempt with up to 2 retries for transient 503
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'أنت محلل تجربة عملاء تنفيذي (Customer Experience Intelligence System) باللغة العربية.',
              responseMimeType: 'application/json',
              responseSchema: ANALYSIS_SCHEMA,
              temperature: 0.2,
            },
          });

          const outputText = response.text?.trim() || '{}';
          try {
            parsed = JSON.parse(outputText);
            break;
          } catch {
            const cleanJson = outputText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
            parsed = JSON.parse(cleanJson);
            break;
          }
        } catch (apiError: any) {
          console.warn(`Gemini attempt ${attempt + 1} failed:`, apiError?.message);
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        }
      }
    }

    // Fallback if Gemini failed or was unavailable
    if (!parsed) {
      console.log('Using Arabic NLP fallback analyzer for comment');
      parsed = fallbackAnalyzeArabicFeedback(comment.trim());
    }

    // Normalize sentiment
    let sentiment: 'إيجابي' | 'سلبي' | 'محايد' = 'محايد';
    if (parsed.sentiment?.includes('إيجاب') || parsed.sentiment?.toLowerCase().includes('positive')) {
      sentiment = 'إيجابي';
    } else if (parsed.sentiment?.includes('سلب') || parsed.sentiment?.toLowerCase().includes('negative')) {
      sentiment = 'سلبي';
    }

    // Normalize priority
    let priority: 'منخفضة' | 'متوسطة' | 'عالية' = 'متوسطة';
    if (parsed.priority?.includes('عال') || parsed.priority?.toLowerCase().includes('high')) {
      priority = 'عالية';
    } else if (parsed.priority?.includes('منخفض') || parsed.priority?.toLowerCase().includes('low')) {
      priority = 'منخفضة';
    }

    const result = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 7),
      comment: comment.trim(),
      sentiment,
      category: parsed.category || 'عام',
      mainIssue: parsed.mainIssue || 'غير محدد',
      priority,
      recommendation: parsed.recommendation || 'متابعة ملاحظة العميل وتوثيقها',
      timestamp: new Date().toISOString(),
      formattedText: `Sentiment: ${sentiment}\nCategory: ${parsed.category || 'عام'}\nMain Issue: ${parsed.mainIssue || 'غير محدد'}\nPriority: ${priority}\nRecommendation: ${parsed.recommendation || 'متابعة ملاحظة العميل وتوثيقها'}`
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error analyzing customer feedback:', error);
    // Ensure always answering
    const fallback = fallbackAnalyzeArabicFeedback(req.body?.comment || '');
    return res.json({
      id: Date.now().toString() + '-fallback',
      comment: req.body?.comment || '',
      ...fallback,
      timestamp: new Date().toISOString(),
      formattedText: `Sentiment: ${fallback.sentiment}\nCategory: ${fallback.category}\nMain Issue: ${fallback.mainIssue}\nPriority: ${fallback.priority}\nRecommendation: ${fallback.recommendation}`
    });
  }
});

// Batch comments analysis
app.post('/api/analyze-batch', async (req, res) => {
  try {
    const { comments } = req.body;
    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ error: 'يرجى تقديم قائمة بتعليقات العملاء' });
    }

    const validComments = comments
      .filter((c: any) => typeof c === 'string' && c.trim().length > 0)
      .slice(0, 10); // cap batch at 10 for quick responsive latency

    if (validComments.length === 0) {
      return res.status(400).json({ error: 'لا توجد نصوص صالحة للتحليل' });
    }

    const ai = getGeminiClient();
    let parsedArray: any[] | null = null;

    if (ai) {
      const prompt = `حلل مجموعة تعليقات العملاء التالية:
${validComments.map((c, i) => `التعليق ${i + 1}: "${c}"`).join('\n')}

لكل تعليق، استخرج بدقة:
- commentIndex: رقم التعليق (1, 2, ...)
- sentiment: إيجابي / سلبي / محايد
- category: تصنيف المشكلة أو الملاحظة
- mainIssue: المشكلة الرئيسية
- priority: منخفضة / متوسطة / عالية
- recommendation: توصية عملية لتحسين الخدمة`;

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'أنت نظام ذكي لتحليل آراء العملاء. أخرج النتيجة بصيغة JSON متطابقة للمخطط.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    commentIndex: { type: Type.INTEGER },
                    sentiment: { type: Type.STRING },
                    category: { type: Type.STRING },
                    mainIssue: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                  },
                  required: ["commentIndex", "sentiment", "category", "mainIssue", "priority", "recommendation"],
                },
              },
              temperature: 0.2,
            },
          });

          parsedArray = JSON.parse(response.text?.trim() || '[]');
          break;
        } catch (apiErr: any) {
          console.warn(`Batch attempt ${attempt + 1} failed:`, apiErr?.message);
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        }
      }
    }

    // If API failed or was unavailable, use fallback analyzer
    if (!parsedArray || parsedArray.length === 0) {
      parsedArray = validComments.map((comm, idx) => {
        const itemFallback = fallbackAnalyzeArabicFeedback(comm);
        return {
          commentIndex: idx + 1,
          ...itemFallback,
        };
      });
    }

    const results = validComments.map((originalText: string, idx: number) => {
      const item = parsedArray?.find((p: any) => p.commentIndex === idx + 1) || parsedArray?.[idx] || fallbackAnalyzeArabicFeedback(originalText);
      let sentiment: 'إيجابي' | 'سلبي' | 'محايد' = 'محايد';
      if (item.sentiment?.includes('إيجاب') || item.sentiment?.toLowerCase?.().includes('positive')) {
        sentiment = 'إيجابي';
      } else if (item.sentiment?.includes('سلب') || item.sentiment?.toLowerCase?.().includes('negative')) {
        sentiment = 'سلبي';
      }

      let priority: 'منخفضة' | 'متوصطة' | 'متوسطة' | 'عالية' = 'متوسطة';
      if (item.priority?.includes('عال') || item.priority?.toLowerCase?.().includes('high')) {
        priority = 'عالية';
      } else if (item.priority?.includes('منخفض') || item.priority?.toLowerCase?.().includes('low')) {
        priority = 'منخفضة';
      }

      return {
        id: Date.now().toString() + '-' + idx,
        comment: originalText,
        sentiment,
        category: item.category || 'عام',
        mainIssue: item.mainIssue || 'غير محدد',
        priority,
        recommendation: item.recommendation || 'متابعة الملاحظة وتوثيقها',
        timestamp: new Date().toISOString(),
        formattedText: `Sentiment: ${sentiment}\nCategory: ${item.category || 'عام'}\nMain Issue: ${item.mainIssue || 'غير محدد'}\nPriority: ${priority}\nRecommendation: ${item.recommendation || 'متابعة الملاحظة وتوثيقها'}`
      };
    });

    return res.json({ results });
  } catch (error: any) {
    console.error('Error analyzing batch comments:', error);
    // Safe response with fallback
    const rawList = Array.isArray(req.body?.comments) ? req.body.comments : [];
    const results = rawList.map((comm: string, idx: number) => {
      const fb = fallbackAnalyzeArabicFeedback(comm);
      return {
        id: Date.now().toString() + '-fb-' + idx,
        comment: comm,
        ...fb,
        timestamp: new Date().toISOString(),
        formattedText: `Sentiment: ${fb.sentiment}\nCategory: ${fb.category}\nMain Issue: ${fb.mainIssue}\nPriority: ${fb.priority}\nRecommendation: ${fb.recommendation}`
      };
    });
    return res.json({ results });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Customer Feedback Intelligence Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
