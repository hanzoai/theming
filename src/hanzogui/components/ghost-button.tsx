import { XStack } from 'hanzogui'

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
    rounded="$4"
    bw={1}
    bc="$color1"
    hoverStyle={{ bc: '$color6', bg: '$color2' }}
    pressStyle={{ bc: '$color6', bg: '$color3' }}
    cur="pointer"
    onPress={onPress}
    {...rest}
  >
    {children}
  </XStack>
)

export default GhostButton
