import { Switch, Theme, type ThemeName } from 'hanzogui'

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
      justifyContent="center"
      px={2}
      pt={0.5}
      bw={1}
      bg={checked ? '' : '$color7'}
      activeStyle={{ backgroundColor: '$color9' }} // Switch has its own activeStyle that runs when checked — overrides whatever bg you set
      bc={checked ? '$color9' : '$color7'} 
      {...rest}
    >
      <Switch.Thumb
        transition="quick"
        size="$xs"
        bg='$color1'
        borderRadius={1000}
        my="auto"
      />
    </Switch>
  </Theme>
)

export default ToggleSwitch
