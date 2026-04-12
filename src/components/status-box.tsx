import { Text, Theme, type ThemeName, XStack, YStack } from '@hanzo/gui'

const StatusBox: React.FC<{
  title: string,
  points: string[],
  theme?: ThemeName | null,
  symbol?: string,
} & React.ComponentProps<typeof YStack>> = ({
  title,
  points,
  theme = 'info',
  symbol = '\u26A1',
  ...rest
}) => (
  <Theme name={theme}>
    <YStack
      rounded="$6"
      px="$4"
      py="$3"
      bg="$background"
      bw={1}
      bc="$borderColor"
      $sm={{ px: '$3' }}
      {...rest}
    >
      <XStack items="center" gap="$2" mb="$2">
        <Text fontSize="$3">{symbol}</Text>
        <Text fontSize="$4" fontWeight="700" color="$color">
          {title}
        </Text>
      </XStack>
      <YStack gap="$1" ml="$1">
        {points.map((point: string, i: number) => (
          <Text key={i} fontSize="$1" color="$color10">
            {'• '}{point}
          </Text>
        ))}
      </YStack>
    </YStack>
  </Theme>
)

export default StatusBox
