import { Container, Flex } from "@chakra-ui/react"
import { BotSimForm } from "./BotSimForm"
import { BotSimAnimator } from "./BotSimAnimator"

export const BotSimContainer = () => {
  return <Container>
    <Flex direction="row" justifyContent="space-between" alignItems="center" mb={4}>
    <BotSimForm />
    <BotSimAnimator />
    </Flex>
  </Container>
}