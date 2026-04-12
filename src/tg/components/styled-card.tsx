import { XStack, YStack, Text, type XStackProps } from '@hanzo/gui'

type StyledCardProps = {
  title: string
  subtitle?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
} & XStackProps

const StyledCard: React.FC<StyledCardProps> = ({
  title,
  subtitle,
  iconLeft,
  iconRight,
  onPress,
  ...rest
}) => (
  <XStack
    items="center"
    gap="$4"
    p="$4"
    w="100%"
    rounded="$6"
    bw={1}
    bc="$borderColor"
    bg="$color2"
    cur={onPress ? 'pointer' : undefined}
    pressStyle={onPress ? { bg: '$color3' } : undefined}
    onPress={onPress}
    {...rest}
  >
    {iconLeft && (
      <XStack w={40} h={40} rounded="$4" bg="$color3" items="center" justify="center" shrink={0}>
        {iconLeft}
      </XStack>
    )}
    <YStack f={1} minW={0}>
      <Text fontWeight="600" fontSize="$4" color="$color">{title}</Text>
      {subtitle && <Text fontSize="$3" color="$color10" marginTop="$0.5">{subtitle}</Text>}
    </YStack>
    {iconRight}
  </XStack>
)

export default StyledCard
