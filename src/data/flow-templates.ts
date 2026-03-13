/**
 * Hardcoded template definitions for the onboarding wizard.
 * When a user picks a template, these questions get copied into
 * their onboarding_flows + flow_questions tables.
 */

export interface TemplateQuestion {
  sort_order: number;
  type: "text" | "select" | "email" | "url";
  text: string;
  required: boolean;
  skippable: boolean;
  options: Array<{ id: string; label: string; emoji?: string }>;
}

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  welcome_message: string;
  success_message: string;
  nickname_format: string;
  questions: TemplateQuestion[];
}

export const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: "community",
    name: "Community Onboarding",
    description: "General-purpose community welcome flow",
    emoji: "👋",
    welcome_message: "👋 Welcome to the community! Let's get you set up quickly.",
    success_message: "You're all set! Welcome aboard. 🎉",
    nickname_format: "{name}",
    questions: [
      {
        sort_order: 0,
        type: "text",
        text: "What's your name?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 1,
        type: "select",
        text: "How did you find us?",
        required: true,
        skippable: false,
        options: [
          { id: "twitter", label: "Twitter/X", emoji: "🐦" },
          { id: "friend", label: "A friend", emoji: "👯" },
          { id: "search", label: "Google search", emoji: "🔍" },
          { id: "other", label: "Other", emoji: "💬" },
        ],
      },
      {
        sort_order: 2,
        type: "text",
        text: "What are you most interested in learning about?",
        required: false,
        skippable: true,
        options: [],
      },
      {
        sort_order: 3,
        type: "select",
        text: "What's your experience level?",
        required: true,
        skippable: false,
        options: [
          { id: "beginner", label: "Beginner", emoji: "🌱" },
          { id: "intermediate", label: "Intermediate", emoji: "🌿" },
          { id: "advanced", label: "Advanced", emoji: "🌳" },
        ],
      },
      {
        sort_order: 4,
        type: "text",
        text: "Anything else you'd like us to know?",
        required: false,
        skippable: true,
        options: [],
      },
    ],
  },
  {
    id: "research",
    name: "Research Network",
    description: "For academic or research-oriented communities",
    emoji: "🔬",
    welcome_message: "🔬 Welcome to the research network! A few quick questions to get you connected.",
    success_message: "You're in! Check the #introductions channel to meet others. 🧪",
    nickname_format: "{name} ({org})",
    questions: [
      {
        sort_order: 0,
        type: "text",
        text: "What's your full name?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 1,
        type: "text",
        text: "What institution or organization are you with?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 2,
        type: "select",
        text: "What's your role?",
        required: true,
        skippable: false,
        options: [
          { id: "student", label: "Student", emoji: "📚" },
          { id: "postdoc", label: "Postdoc", emoji: "🎓" },
          { id: "professor", label: "Professor", emoji: "👨‍🏫" },
          { id: "industry", label: "Industry researcher", emoji: "🏢" },
        ],
      },
      {
        sort_order: 3,
        type: "text",
        text: "What's your primary research area?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 4,
        type: "email",
        text: "What's your institutional email?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 5,
        type: "url",
        text: "Link to your Google Scholar or personal site? (optional)",
        required: false,
        skippable: true,
        options: [],
      },
      {
        sort_order: 6,
        type: "text",
        text: "What are you hoping to get from this community?",
        required: false,
        skippable: true,
        options: [],
      },
      {
        sort_order: 7,
        type: "select",
        text: "Would you be open to collaborations?",
        required: true,
        skippable: false,
        options: [
          { id: "yes", label: "Yes, definitely!", emoji: "🤝" },
          { id: "maybe", label: "Maybe, depends", emoji: "🤔" },
          { id: "no", label: "Just here to learn", emoji: "📖" },
        ],
      },
    ],
  },
  {
    id: "saas",
    name: "SaaS Community",
    description: "For product communities and customer onboarding",
    emoji: "🚀",
    welcome_message: "🚀 Welcome! Let's get your profile set up so we can help you better.",
    success_message: "You're in! Head to #getting-started for your next steps. 💪",
    nickname_format: "{name} | {org}",
    questions: [
      {
        sort_order: 0,
        type: "text",
        text: "What's your name?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 1,
        type: "text",
        text: "What company are you from?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 2,
        type: "select",
        text: "What's your role?",
        required: true,
        skippable: false,
        options: [
          { id: "founder", label: "Founder/CEO", emoji: "👑" },
          { id: "product", label: "Product", emoji: "📦" },
          { id: "engineering", label: "Engineering", emoji: "⚙️" },
          { id: "marketing", label: "Marketing", emoji: "📢" },
        ],
      },
      {
        sort_order: 3,
        type: "select",
        text: "Are you currently a customer?",
        required: true,
        skippable: false,
        options: [
          { id: "yes", label: "Yes", emoji: "✅" },
          { id: "trial", label: "On a trial", emoji: "⏳" },
          { id: "evaluating", label: "Evaluating", emoji: "🔍" },
          { id: "no", label: "Not yet", emoji: "👀" },
        ],
      },
      {
        sort_order: 4,
        type: "email",
        text: "What's your work email?",
        required: true,
        skippable: false,
        options: [],
      },
      {
        sort_order: 5,
        type: "text",
        text: "What's your biggest challenge right now?",
        required: false,
        skippable: true,
        options: [],
      },
    ],
  },
];

export function getTemplateById(id: string): FlowTemplate | undefined {
  return FLOW_TEMPLATES.find((t) => t.id === id);
}
