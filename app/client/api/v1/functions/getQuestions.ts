// path: src/api/v1/functions/getQuestions.ts

export async function getQuestions(
  page: any,
  settings: { scrapeTimeout: number },
  messages: { getError: (key: string) => string },
  result: { questions?: number | null },
  executionData?: {
    markCompleted?: (step: string) => void;
    addError?: (error: { step: string; message: string }) => void;
  }
): Promise<void> {
  try {
    await page.waitForSelector('.product-questions__count', { 
      timeout: settings.scrapeTimeout 
    });

    const questionsCount = await page.evaluate((): number | null => {
      const el = document.querySelector('.product-questions__count');
      return el ? parseInt(el.textContent?.replace(/\D/g, '') || '0', 10) || 0 : null;
    });

    if (questionsCount === null) {
      throw new Error('Questions count not found');
    }

    result.questions = questionsCount;
    executionData?.markCompleted?.('questions');
  } catch (err: any) {
    executionData?.addError?.({
      step: 'questions',
      message: `${messages.getError('getQuestionsError')} ${err.message}`
    });
  }
}