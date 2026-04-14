import { Switch, Theme, type ThemeName } from '@hanzo/gui'

// A branded toggle switch. When checked, uses the primary theme;
// when unchecked, uses neutral grey colors.
//
// Usage:
//   <ToggleSwitch checked={value} onCheckedChange={setValue} />

const ToggleSwitch: React.FC<{
  checked: boolean,
  onCheckedChange: (val: boolean) => void,
  id?: string,
  theme?: ThemeName | null,
} & Omit<React.ComponentProps<typeof Switch>, 'checked' | 'onCheckedChange'>> = ({
  checked,
  onCheckedChange,
  id,
  theme = 'primary' as ThemeName,
  ...rest
}) => (
  <Theme name={checked ? theme : null}>
    <Switch
      id={id}
      size="$3"
      checked={checked}
      onCheckedChange={onCheckedChange}
      jc="center"
      px={2}
      bw={1}
      bg={checked ? '$color9' : '$color7'}
      bc={checked ? '$color8' : '$color8'}
      {...rest}
    >
      <Switch.Thumb
        animation="quick"
        size="$xs"
        bg={checked ? '$background' : '$color7'}
        borderRadius={1000}
        my="auto"
      />
    </Switch>
  </Theme>
)

export default ToggleSwitch
