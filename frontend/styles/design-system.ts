/**
 * PERSONA DESIGN SYSTEM
 *
 * Design system untuk Persona Protocol frontend.
 * Semua komponen mengikuti style Microsoft/Trello yang compact dan professional.
 */

// ==========================================
// COLORS
// ==========================================

export const colors = {
  // Primary
  primary: {
    50: "bg-blue-50 text-blue-700",
    100: "bg-blue-100 text-blue-700",
    600: "bg-blue-600 text-white",
    700: "bg-blue-700 text-white",
  },

  // Success
  success: {
    50: "bg-green-50 text-green-900",
    600: "bg-green-600 text-white",
    700: "bg-green-700 text-white",
  },

  // Error
  error: {
    50: "bg-red-50 text-red-900",
  },

  // Warning
  warning: {
    50: "bg-amber-50",
    200: "border-amber-200",
  },

  // Neutral
  gray: {
    50: "bg-gray-50",
    100: "bg-gray-100",
    200: "border-gray-200",
    300: "border-gray-300",
    400: "text-gray-400",
    600: "text-gray-600",
    700: "text-gray-700",
    900: "text-gray-900 bg-gray-900",
  },

  // Background
  white: "bg-white",
};

// ==========================================
// TYPOGRAPHY
// ==========================================

export const typography = {
  // Headings
  h1: "text-3xl font-semibold text-gray-900",
  h2: "text-2xl font-semibold text-gray-900",
  h3: "text-xl font-semibold text-gray-900",
  h4: "text-lg font-semibold text-gray-900",

  // Body
  body: "text-sm text-gray-600",
  bodyBold: "text-sm font-medium text-gray-700",
  bodyLarge: "text-base text-gray-600",

  // Small
  small: "text-xs text-gray-600",
  smallBold: "text-xs font-medium text-gray-700",

  // Code
  code: "text-xs text-gray-900",
  codeInline: "rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-900",
};

// ==========================================
// SPACING
// ==========================================

export const spacing = {
  // Padding
  p: {
    xs: "p-3",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  },

  px: {
    xs: "px-3",
    sm: "px-4",
    md: "px-5",
    lg: "px-6",
  },

  py: {
    xs: "py-1.5",
    sm: "py-2",
    md: "py-2.5",
    lg: "py-3",
    xl: "py-12",
  },

  // Margin
  mb: {
    xs: "mb-1",
    sm: "mb-2",
    md: "mb-4",
    lg: "mb-6",
    xl: "mb-8",
  },

  mt: {
    xs: "mt-1",
    sm: "mt-2",
    md: "mt-4",
    lg: "mt-6",
    xl: "mt-8",
  },

  // Gap
  gap: {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  },

  // Space between
  spaceY: {
    xs: "space-y-1.5",
    sm: "space-y-2",
    md: "space-y-3",
    lg: "space-y-4",
  },
};

// ==========================================
// BORDERS & SHADOWS
// ==========================================

export const borders = {
  radius: {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  },

  width: {
    default: "border border-gray-200",
    thick: "border-2 border-gray-300",
    bottom: "border-b border-gray-200",
    bottomThick: "border-b-2",
  },

  shadow: {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    hover: "hover:shadow-md",
  },
};

// ==========================================
// BUTTONS
// ==========================================

export const buttons = {
  // Primary button (blue)
  primary:
    "rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",

  // Secondary button (white with border)
  secondary:
    "rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50",

  // Success button (green)
  success:
    "rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700",

  // Small navigation button
  nav: "rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100",
  navActive: "rounded px-3 py-1.5 text-sm font-medium bg-blue-600 text-white",

  // Tab button
  tab: "flex items-center gap-2 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors",
  tabActive:
    "flex items-center gap-2 border-b-2 border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors",

  // Full width
  fullWidth: "w-full",
};

// ==========================================
// CARDS
// ==========================================

export const cards = {
  // Basic card
  base: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",

  // Feature card (with hover)
  feature: "rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md",

  // Info box
  info: "rounded-md border border-gray-200 bg-gray-50 p-4",
  infoBlue: "rounded-md border border-blue-200 bg-blue-50 p-4",
  infoWarning: "rounded-md border border-amber-200 bg-amber-50 p-4",

  // Code block
  code: "rounded-lg border border-gray-200 bg-white shadow-sm",
  codeHeader: "border-b border-gray-200 bg-gray-50 px-4 py-2",
  codeContent: "rounded-md bg-gray-900 p-3",

  // Result card
  success: "rounded-md p-4 bg-green-50 text-green-900",
  error: "rounded-md p-4 bg-red-50 text-red-900",
};

// ==========================================
// FORM INPUTS
// ==========================================

export const inputs = {
  // Text input
  text: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",

  // Select
  select:
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",

  // Label
  label: "mb-1.5 block text-sm font-medium text-gray-700",
};

// ==========================================
// LAYOUT
// ==========================================

export const layout = {
  // Container max widths
  container: {
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  },

  // Flex utilities
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center",
    col: "flex flex-col",
  },

  // Grid
  grid: {
    cols2: "grid gap-4 sm:grid-cols-2",
    cols3: "grid gap-4 sm:grid-cols-3",
  },
};

// ==========================================
// UTILITIES
// ==========================================

export const utils = {
  // Common utilities
  truncate: "truncate",
  centerText: "text-center",
  transition: "transition-colors",

  // Opacity
  opacity: {
    50: "opacity-50",
    90: "opacity-90",
  },
};

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*
BUTTON EXAMPLES:
-----------------
<button className={buttons.primary}>Primary Button</button>
<button className={buttons.secondary}>Secondary Button</button>
<button className={`${buttons.primary} ${buttons.fullWidth}`}>Full Width Primary</button>

CARD EXAMPLES:
--------------
<div className={cards.base}>Basic Card</div>
<div className={cards.feature}>Feature Card with Hover</div>
<div className={cards.infoBlue}>Blue Info Box</div>

TYPOGRAPHY EXAMPLES:
--------------------
<h1 className={typography.h1}>Heading 1</h1>
<p className={typography.body}>Body text</p>
<code className={typography.codeInline}>inline code</code>

INPUT EXAMPLES:
---------------
<label className={inputs.label}>Email</label>
<input type="email" className={inputs.text} />

LAYOUT EXAMPLES:
----------------
<div className={layout.flex.between}>Space Between</div>
<div className={layout.grid.cols3}>Grid 3 Columns</div>

SPACING EXAMPLES:
-----------------
<div className={`${cards.base} ${spacing.mb.lg}`}>Card with margin bottom</div>
<div className={spacing.p.lg}>Padding large</div>
*/
