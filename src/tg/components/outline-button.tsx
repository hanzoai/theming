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
    bg="$grey2"
    bw={1}
    bc="$grey6"
    cur="pointer"
    opacity={disabled ? 0.4 : 1}
    hoverStyle={{ bg: '$grey3', bc: '$grey7' }}
    pressStyle={{ bg: '$grey4', bc: '$grey7' }}
    onPress={disabled ? undefined : onPress}
    {...rest}
  >
    {typeof children === 'string' ? (
      <Text color="$grey12" fontWeight="500" fontSize="$3">{children}</Text>
    ) : (
      children
    )}
  </XStack>
)

export default OutlineButton
