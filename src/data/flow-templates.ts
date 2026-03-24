/**
 * Hardcoded template definitions for the onboarding wizard.
 * When a user picks a template, these questions get copied into
 * their onboarding_flows + flow_questions tables.
 */

export interface TemplateQuestion {
  sort_order: number;
  type: "text" | "select" | "multi_select" | "email" | "url";
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
    welcome_message: "😎 Welcome to {server_name} 😎 I'm going to need some ID. How many drinks have you had tonight?",
    success_message: "✅ You're in. Don't cause trouble. 😎",
    nickname_format: "{name}",
    questions: [
      { sort_order: 0, type: "text", text: "What's your name?", required: true, skippable: false, options: [] },
      { sort_order: 1, type: "select", text: "What best describes your role?", required: true, skippable: false, options: [
        { id: "community-member", label: "Community Member", emoji: "👥" },
        { id: "contributor", label: "Contributor", emoji: "🛠️" },
        { id: "moderator", label: "Moderator", emoji: "🛡️" },
        { id: "just-browsing", label: "Just Browsing", emoji: "👀" },
      ]},
      { sort_order: 2, type: "multi_select", text: "What are you interested in?", required: false, skippable: true, options: [
        { id: "design", label: "Design", emoji: "🎨" },
        { id: "engineering", label: "Engineering", emoji: "⚙️" },
        { id: "product", label: "Product", emoji: "📦" },
        { id: "marketing", label: "Marketing", emoji: "📢" },
        { id: "business", label: "Business", emoji: "💼" },
        { id: "other", label: "Other", emoji: "💬" },
      ]},
      { sort_order: 3, type: "select", text: "How did you find us?", required: false, skippable: true, options: [
        { id: "twitter", label: "Twitter", emoji: "🐦" },
        { id: "linkedin", label: "LinkedIn", emoji: "💼" },
        { id: "friend", label: "Friend", emoji: "👯" },
        { id: "google", label: "Google", emoji: "🔍" },
        { id: "event", label: "Event", emoji: "🎪" },
        { id: "other", label: "Other", emoji: "💬" },
      ]},
      { sort_order: 4, type: "email", text: "What's your email?", required: false, skippable: true, options: [] },
    ],
  },
  {
    id: "research",
    name: "Research Network",
    description: "For academic or research-oriented communities",
    emoji: "🔬",
    welcome_message: "😎 Welcome to {server_name} 😎 I'm going to need some ID. How many drinks have you had tonight?",
    success_message: "✅ You're in. Don't cause trouble. 😎",
    nickname_format: "{name} ({org})",
    questions: [
      { sort_order: 0, type: "text", text: "What's your full name?", required: true, skippable: false, options: [] },
      { sort_order: 1, type: "select", text: "What's your role?", required: true, skippable: false, options: [
        { id: "student", label: "Student", emoji: "📚" },
        { id: "postdoc", label: "Postdoc", emoji: "🎓" },
        { id: "professor", label: "Professor", emoji: "👨‍🏫" },
        { id: "industry", label: "Industry Researcher", emoji: "🏢" },
      ]},
      { sort_order: 2, type: "text", text: "What's your organization?", required: true, skippable: false, options: [] },
      { sort_order: 3, type: "multi_select", text: "What are your research areas?", required: true, skippable: false, options: [
        { id: "ai-ml", label: "AI / Machine Learning", emoji: "🤖" },
        { id: "biology", label: "Biology", emoji: "🧬" },
        { id: "physics", label: "Physics", emoji: "⚛️" },
        { id: "chemistry", label: "Chemistry", emoji: "🧪" },
        { id: "engineering", label: "Engineering", emoji: "⚙️" },
        { id: "social-sciences", label: "Social Sciences", emoji: "📊" },
        { id: "other", label: "Other", emoji: "💬" },
      ]},
      { sort_order: 4, type: "email", text: "What's your institutional email?", required: true, skippable: false, options: [] },
      { sort_order: 5, type: "url", text: "Google Scholar or personal site?", required: false, skippable: true, options: [] },
      { sort_order: 6, type: "select", text: "Open to collaborations?", required: true, skippable: false, options: [
        { id: "yes", label: "Yes, definitely!", emoji: "🤝" },
        { id: "maybe", label: "Maybe, depends", emoji: "🤔" },
        { id: "no", label: "Just here to learn", emoji: "📖" },
      ]},
    ],
  },
  {
    id: "saas",
    name: "SaaS Community",
    description: "For product communities and customer onboarding",
    emoji: "🚀",
    welcome_message: "😎 Welcome to {server_name} 😎 I'm going to need some ID. How many drinks have you had tonight?",
    success_message: "✅ You're in. Don't cause trouble. 😎",
    nickname_format: "{name} | {org}",
    questions: [
      { sort_order: 0, type: "text", text: "What's your name?", required: true, skippable: false, options: [] },
      { sort_order: 1, type: "text", text: "Company name?", required: true, skippable: false, options: [] },
      { sort_order: 2, type: "select", text: "What's your role?", required: true, skippable: false, options: [
        { id: "founder", label: "Founder / CEO", emoji: "👑" },
        { id: "product", label: "Product", emoji: "📦" },
        { id: "engineering", label: "Engineering", emoji: "⚙️" },
        { id: "marketing", label: "Marketing", emoji: "📢" },
        { id: "sales", label: "Sales", emoji: "💰" },
        { id: "other", label: "Other", emoji: "💬" },
      ]},
      { sort_order: 3, type: "select", text: "Are you a customer?", required: true, skippable: false, options: [
        { id: "yes", label: "Yes", emoji: "✅" },
        { id: "trial", label: "On a trial", emoji: "⏳" },
        { id: "evaluating", label: "Evaluating", emoji: "🔍" },
        { id: "not-yet", label: "Not yet", emoji: "👀" },
      ]},
      { sort_order: 4, type: "multi_select", text: "What features interest you?", required: false, skippable: true, options: [
        { id: "analytics", label: "Analytics", emoji: "📊" },
        { id: "integrations", label: "Integrations", emoji: "🔗" },
        { id: "automation", label: "Automation", emoji: "🤖" },
        { id: "api", label: "API", emoji: "🛠️" },
        { id: "support", label: "Support", emoji: "🙋" },
      ]},
      { sort_order: 5, type: "email", text: "Work email?", required: true, skippable: false, options: [] },
    ],
  },
];

export function getTemplateById(id: string): FlowTemplate | undefined {
  return FLOW_TEMPLATES.find((t) => t.id === id);
}
