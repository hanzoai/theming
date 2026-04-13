# Components

Themed components built on Tamagui and aware of our theming mechanism, so they work with any palette — not just `primary`.

```typescript
import { ThemedButton, StatusBox, ToggleSwitch } from '@hanzo/branding/tg-components'
```

## ThemedButton

Solid color button. Defaults to `theme="primary"`.

```tsx
<ThemedButton onPress={handleSubmit}>Submit</ThemedButton>
<ThemedButton theme="danger" onPress={handleDelete}>Delete</ThemedButton>
<ThemedButton theme={null}>Cancel</ThemedButton>
```

## GhostButton

Borderless button that reveals border + tint on hover/press.

```tsx
<GhostButton onPress={handleAlt}>Try another way</GhostButton>
```

## OutlineButton

Outlined button with border and subtle background.

```tsx
<OutlineButton onPress={handleCancel}>Cancel</OutlineButton>
```

## StatusBox

Callout box for tips, errors, warnings. Takes a theme name and bullet points.

```tsx
<StatusBox title="Tip" points={['First point', 'Second point']} />
<StatusBox title="Error" points={['Something broke']} theme="danger" symbol="⚠️" />
<StatusBox title="Done" points={['All set']} theme="success" symbol="✓" />
```

## ToggleSwitch

Branded toggle. Uses the theme palette when checked, neutral when unchecked.

```tsx
<ToggleSwitch checked={value} onCheckedChange={setValue} />
<ToggleSwitch checked={value} onCheckedChange={setValue} theme="success" />
```

## StyledCard

Pressable card with optional icon slots.

```tsx
<StyledCard
  title="Bank Account"
  subtitle="Chase ••1234"
  iconLeft={<BankIcon />}
  onPress={handleSelect}
/>
```
