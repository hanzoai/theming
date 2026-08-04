import { Text, Theme, type ThemeName, XStack, useTheme } from '@hanzo/gui'

const ThemedButtonInner: React.FC<{
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
} & Record<string, any>> = ({
  children,
  onPress,
  disabled,
  ...rest
}) => {
  const t = useTheme()
  const solidText = (t as any).solidText?.val ?? '#fff'

  return (
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
        <Text color={solidText} fontWeight="500" fontSize="$3">{children}</Text>
      ) : (
        children
      )}
    </XStack>
  )
}

const ThemedButton: React.FC<{
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  theme?: ThemeName | null
  w?: string | number
  f?: number
} & Record<string, any>> = ({
  theme = 'primary' as ThemeName,
  ...rest
}) => (
  <Theme name={theme}>
    <ThemedButtonInner {...rest} />
  </Theme>
)

export default ThemedButton
