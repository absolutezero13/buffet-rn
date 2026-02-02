import { Asset } from "../../../services/types";

const AI_RESPONSES = [
  "Based on Warren Buffett's principles, focus on companies with strong fundamentals and competitive advantages.",
  "Diversification is key. Consider spreading your investments across different asset classes.",
  "Remember: 'Be fearful when others are greedy, and greedy when others are fearful.' - Warren Buffett",
  "Long-term investing typically outperforms short-term trading. Patience is a virtue in investing.",
  "Always do your own research before making investment decisions. Past performance doesn't guarantee future results.",
  "Consider your risk tolerance and investment timeline when building your portfolio.",
  "Dollar-cost averaging can help reduce the impact of market volatility on your investments.",
  "Keep an emergency fund before investing. Financial stability comes first.",
];

interface PortfolioContext {
  assets: Asset[];
  totalValue: number;
  totalGainLoss: number;
}

export function generateAIResponse(
  userMessage: string,
  portfolio: PortfolioContext,
): string {
  const lowerMessage = userMessage.toLowerCase();
  const { assets, totalValue, totalGainLoss } = portfolio;

  if (lowerMessage.includes("portfolio") || lowerMessage.includes("holdings")) {
    if (assets.length === 0) {
      return "You don't have any assets in your portfolio yet. Head to the Portfolio tab to add your first investment!";
    }
    const gainLossText =
      totalGainLoss >= 0
        ? `up $${totalGainLoss.toFixed(2)}`
        : `down $${Math.abs(totalGainLoss).toFixed(2)}`;
    return `Your portfolio is currently worth $${totalValue.toFixed(2)} and you're ${gainLossText}. You have ${assets.length} asset(s). Keep up the good work tracking your investments!`;
  }

  if (lowerMessage.includes("buffett") || lowerMessage.includes("warren")) {
    return "Warren Buffett, the Oracle of Omaha, emphasizes buying quality businesses at fair prices and holding them for the long term. His key principles include understanding what you invest in, maintaining a margin of safety, and being patient.";
  }

  if (lowerMessage.includes("stock") || lowerMessage.includes("buy")) {
    return "When considering stocks, look for companies with strong competitive advantages (moats), consistent earnings growth, competent management, and reasonable valuations. Always invest within your circle of competence.";
  }

  if (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin")) {
    return "Cryptocurrency is a highly volatile asset class. If you choose to invest, only allocate what you can afford to lose. Many traditional investors recommend limiting crypto to 5-10% of your portfolio.";
  }

  if (lowerMessage.includes("diversif")) {
    return "Diversification helps reduce risk by spreading investments across different asset classes, sectors, and geographies. However, over-diversification can dilute returns. Find the right balance for your risk tolerance.";
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! I'm Buffet AI, your investment companion. I can help you understand investment principles, discuss your portfolio, or share wisdom from legendary investors. What would you like to know?";
  }

  return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
}
