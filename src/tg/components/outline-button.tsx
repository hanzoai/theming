import { Text, XStack } from '@hanzo/gui'

const OutlineButton: React.FC<{
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
} & Record<string, any>> = ({
  children,
  onPress,
  disabled,
  ...rest
}) => (
  <XStack
    justify="center"
    items="center"
    gap="$2"
    h="$md"
    rounded="$6"
    px="$6"
    bg="$color2"
    bw={1}
    bc="$color6"
    cur="pointer"
    opacity={disabled ? 0.4 : 1}
    hoverStyle={{ bg: '$color3', bc: '$color7' }}
    pressStyle={{ bg: '$color4', bc: '$color7' }}
    onPress={disabled ? undefined : onPress}
    {...rest}
  >
    {typeof children === 'string' ? (
      <Text color="$color" fontWeight="500" fontSize="$3">{children}</Text>
    ) : (
      children
    )}
  </XStack>
)

export default OutlineButton
