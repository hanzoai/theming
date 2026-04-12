import { Text, Theme, type ThemeName, XStack } from '@hanzo/gui'

const ThemedButton: React.FC<{
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  theme?: ThemeName | null
  w?: string | number
  f?: number
} & Record<string, any>> = ({
  children,
  onPress,
  disabled,
  theme = 'primary' as ThemeName,
  ...rest
}) => (
  <Theme name={theme}>
    <XStack
      justify="center"
      items="center"
      gap="$2"
      h="$md"
      rounded="$6"
      px="$6"
      bg="$background"
      cur="pointer"
      opacity={disabled ? 0.4 : 1}
      pressStyle={{ bg: '$backgroundPress' }}
      onPress={disabled ? undefined : onPress}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text color="$color" fontWeight="500" fontSize="$3">{children}</Text>
      ) : (
        children
      )}
    </XStack>
  </Theme>
)

export default ThemedButton
