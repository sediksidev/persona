# Persona Design System

Design system untuk Persona Protocol frontend dengan style Microsoft/Trello yang compact dan professional.

## 📁 File Location

```styles/design-system.ts```

## 🎨 Core Principles

1. **Compact & Professional** - Microsoft/Trello inspired
2. **Consistent Spacing** - Menggunakan Tailwind spacing scale
3. **Clear Hierarchy** - Typography yang jelas
4. **Accessible Colors** - WCAG compliant color contrast

## 📚 Categories

### Colors

```tsx
import { colors } from '@/styles/design-system';

// Primary (Blue)
<div className={colors.primary[600]}>Primary Blue</div>

// Success (Green)
<div className={colors.success[600]}>Success Green</div>

// Neutral (Gray)
<p className={colors.gray[600]}>Gray Text</p>
```

### Typography

```tsx
import { typography } from '@/styles/design-system';

<h1 className={typography.h1}>Main Heading</h1>
<h2 className={typography.h2}>Section Heading</h2>
<p className={typography.body}>Body text</p>
<code className={typography.codeInline}>code snippet</code>
```

### Buttons

```tsx
import { buttons } from '@/styles/design-system';

// Primary action
<button className={buttons.primary}>Submit</button>

// Secondary action
<button className={buttons.secondary}>Cancel</button>

// Success action
<button className={buttons.success}>Connect</button>

// Navigation
<Link className={buttons.nav}>Link</Link>
<Link className={buttons.navActive}>Active Link</Link>

// Tab button
<button className={buttons.tab}>Tab</button>
<button className={buttons.tabActive}>Active Tab</button>

// Full width
<button className={`${buttons.primary} ${buttons.fullWidth}`}>
  Full Width Button
</button>
```

### Cards

```tsx
import { cards } from '@/styles/design-system';

// Basic card
<div className={cards.base}>
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Feature card with hover effect
<div className={cards.feature}>
  <h3>Feature</h3>
  <p>Description</p>
</div>

// Info boxes
<div className={cards.info}>General info</div>
<div className={cards.infoBlue}>Important info</div>
<div className={cards.infoWarning}>Warning info</div>

// Code block
<div className={cards.code}>
  <div className={cards.codeHeader}>
    <p>Solidity</p>
  </div>
  <pre className={cards.codeContent}>
    <code>// code here</code>
  </pre>
</div>

// Result cards
<div className={cards.success}>Success message</div>
<div className={cards.error}>Error message</div>
```

### Form Inputs

```tsx
import { inputs } from '@/styles/design-system';

// Text input
<label className={inputs.label}>Email</label>
<input type="email" className={inputs.text} />

// Select dropdown
<label className={inputs.label}>Gender</label>
<select className={inputs.select}>
  <option>Male</option>
  <option>Female</option>
</select>
```

### Spacing

```tsx
import { spacing } from '@/styles/design-system';

// Padding
<div className={spacing.p.lg}>Padding large</div>
<div className={spacing.px.md}>Horizontal padding medium</div>
<div className={spacing.py.sm}>Vertical padding small</div>

// Margin
<div className={spacing.mb.lg}>Margin bottom large</div>
<div className={spacing.mt.md}>Margin top medium</div>

// Gap (for flex/grid)
<div className={`flex ${spacing.gap.sm}`}>Items with gap</div>

// Space between children
<div className={spacing.spaceY.md}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Borders & Shadows

```tsx
import { borders } from '@/styles/design-system';

// Border radius
<div className={borders.radius.md}>Medium rounded</div>
<div className={borders.radius.lg}>Large rounded</div>
<div className={borders.radius.full}>Circular</div>

// Border width
<div className={borders.width.default}>Default border</div>
<div className={borders.width.bottom}>Bottom border only</div>

// Shadows
<div className={borders.shadow.sm}>Small shadow</div>
<div className={borders.shadow.hover}>Hover shadow effect</div>
```

### Layout

```tsx
import { layout } from '@/styles/design-system';

// Container max widths
<div className={layout.container['4xl']}>4xl container</div>

// Flex utilities
<div className={layout.flex.between}>Space Between</div>
<div className={layout.flex.center}>Centered</div>
<div className={layout.flex.start}>Flex start</div>

// Grid
<div className={layout.grid.cols3}>3 column grid</div>
<div className={layout.grid.cols2}>2 column grid</div>
```

## 🔧 Usage

### Import Design System

```tsx
import { buttons, cards, typography, spacing } from '@/styles/design-system';
```

### Compose Styles

```tsx
// Combine multiple style objects
<div className={`${cards.base} ${spacing.mb.lg}`}>
  <h2 className={typography.h2}>Title</h2>
  <p className={typography.body}>Content</p>
  <button className={buttons.primary}>Action</button>
</div>
```

## 📋 Quick Reference

### Common Patterns

**Card with heading and button:**

```tsx
<div className={cards.base}>
  <h3 className={typography.h3}>Title</h3>
  <p className={typography.body}>Description</p>
  <button className={buttons.primary}>Action</button>
</div>
```

**Form group:**

```tsx
<div>
  <label className={inputs.label}>Label</label>
  <input className={inputs.text} />
</div>
```

**Info box with icon:**

```tsx
<div className={cards.infoBlue}>
  <p className={typography.smallBold}>Note:</p>
  <p className={typography.body}>Information text</p>
</div>
```

**Navigation tabs:**

```tsx
<div className="flex gap-2 border-b">
  <button className={buttons.tabActive}>Active</button>
  <button className={buttons.tab}>Inactive</button>
</div>
```

## 🎯 Best Practices

1. **Consistency**: Selalu gunakan design system, hindari custom inline styles
2. **Composition**: Combine style objects untuk membuat variant baru
3. **Spacing**: Gunakan predefined spacing untuk konsistensi
4. **Colors**: Stick to color palette yang sudah ditentukan
5. **Typography**: Gunakan typography hierarchy untuk readability

## 📝 Notes

- Semua style menggunakan Tailwind CSS classes
- Design mengikuti Microsoft/Trello compact aesthetic
- Responsive by default dengan Tailwind breakpoints
- Focus state sudah ditambahkan untuk accessibility
