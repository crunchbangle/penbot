import { Container, Flex } from "@chakra-ui/react"
import { BotSimForm } from "./BotSimForm"
import { BotSimAnimator } from "./BotSimAnimator"
import type { FormValues } from "./BotSimForm"
import { Bot, type BotPosition } from "../botsim/bot"
import { useState } from "react"

export const BotSimContainer = () => {
    const [states, setStates] = useState<BotPosition[]>([]);
    const [bot, setBot] = useState<Bot>(new Bot());

    const expand = (instructions: string) => 
        instructions.replaceAll(/(\D)(\d+)/g, (_,c,n) => 
        c.repeat(parseInt(n)));
    

    const onSubmit = (formData: FormValues) => {
        const bot = new Bot(formData);
        const r = bot.bresenham(expand(formData.instructions));
        setStates(r);
        setBot(bot);
    }

    return <Container>
        <Flex direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <BotSimForm onSubmit={onSubmit} />
        <BotSimAnimator states={states} bot={bot} />
        </Flex>
    </Container>
}