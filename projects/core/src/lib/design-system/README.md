# Core Design System SCSS

Import `design-system.scss` in your miniapp's main SCSS file to use shared styles, variables, mixins, and components.

## Usage Example
```scss
@import 'projects/core/src/lib/design-system/design-system';
```

## Features
- Variables: colors, spacing, border-radius, font-family
- Mixins: flex-center, card-shadow
- Components: button, card, typography, form controls (input/select)

## Class Examples
- `.ds-btn.primary`, `.ds-btn.secondary`, `.ds-btn.danger`, `.ds-btn.sm`, `.ds-btn.lg`, `.ds-btn.full-width`
- `.ds-field`, `.ds-label`, `.ds-input`, `.ds-select`, `.ds-error`, `.ds-hint`
- `.ds-card`
- `.ds-heading`, `.ds-text`
