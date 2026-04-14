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
    bc="$grey6"
    bg="$grey2"
    cur={onPress ? 'pointer' : undefined}
    pressStyle={onPress ? { bg: '$grey3' } : undefined}
    onPress={onPress}
    {...rest}
  >
    {iconLeft && (
      <XStack w={40} h={40} rounded="$4" bg="$grey3" items="center" justify="center" shrink={0}>
        {iconLeft}
      </XStack>
    )}
    <YStack f={1} minW={0}>
      <Text fontWeight="600" fontSize="$4" color="$grey12">{title}</Text>
      {subtitle && <Text fontSize="$3" color="$grey10" marginTop="$0.5">{subtitle}</Text>}
    </YStack>
    {iconRight}
  </XStack>
)

export default StyledCard
