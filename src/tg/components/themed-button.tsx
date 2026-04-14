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
      rounded="$4"
      px="$6"
      bg="$color9"
      cur={disabled ? 'default' : 'pointer'}
      opacity={disabled ? 0.6 : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
      hoverStyle={disabled ? undefined : { bg: '$color10' }}
      pressStyle={disabled ? undefined : { bg: '$color8' }}
      onPress={disabled ? undefined : onPress}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text color="$solidText" fontWeight="500" fontSize="$3">{children}</Text>
      ) : (
        children
      )}
    </XStack>
  </Theme>
)

export default ThemedButton
