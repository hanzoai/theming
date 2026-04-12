import { XStack } from '@hanzo/gui'

// TODO: Move to @hanzo/gui as a library component with tests.
//
// A borderless button that reveals border + bg tint on hover/press.
//
// Usage:
//   <GhostButton onPress={handleAlt}>Try another way</GhostButton>
//   <GhostButton w="100%">Full width</GhostButton>

const GhostButton: React.FC<{
  children: React.ReactNode,
  onPress?: () => void,
} & React.ComponentProps<typeof XStack>> = ({
  children,
  onPress,
  ...rest
}) => (
  <XStack
    justify="center"
    items="center"
    gap="$2"
    h="$md"
    rounded="$6"
    bw={1}
    bc="$background"
    hoverStyle={{ bc: '$borderColorPress', bg: '$color2' }}
    pressStyle={{ bc: '$borderColorPress', bg: '$color3' }}
    cur="pointer"
    onPress={onPress}
    {...rest}
  >
    {children}
  </XStack>
)

export default GhostButton
