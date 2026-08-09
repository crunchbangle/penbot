import {Stack, Text} from "@chakra-ui/react"
import type { Bot, BotPosition } from "../botsim/bot"

interface BotSimAnimatorProps {
    states: BotPosition[]
    bot: Bot
}

export const BotSimAnimator: React.FC<BotSimAnimatorProps> = (props: BotSimAnimatorProps) => <>
    <Text>This is some text</Text>
    <Stack>
        {props.states.map((x, i) => <Text key={`state-${i}`}>{x.pen.x}, {x.pen.y}, {x.orientation}</Text>)}
    </Stack>
    {
        /**
         * TODO:
         * animate the thing!
         * 
         * first, can just do the pen
         * 
         * then can use the settings in bot to draw the wheels
         */
    }
</>