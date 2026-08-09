import {Button, Field, Input, Stack} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { defaultBotProps } from "../botsim/bot"

interface BotSimFormProps {
    onSubmit: (formValues: FormValues) => void
}

export interface FormValues {
    instructions: string
    wheelDiameter: number
    axleWidth: number
    penDistanceFromAxle: number
    penOffsetFromCenterline: number
    deadband: number
    startX: number
    startY: number
}

export const BotSimForm: React.FC<BotSimFormProps> = (props:BotSimFormProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            instructions: 'L1200B3000R1200C4755',
            ...defaultBotProps,
            startX: 10,
            startY: 270
        },
    })

    const onSubmit = handleSubmit((data) => props.onSubmit(data))

    return <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.instructions}>
          <Field.Label>Instructions</Field.Label>
          <Input {...register("instructions")} />
          <Field.ErrorText>{errors.instructions?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.wheelDiameter}>
          <Field.Label>Wheel Diameter</Field.Label>
          <Input {...register("wheelDiameter", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.wheelDiameter?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.axleWidth}>
          <Field.Label>Wheel Distance</Field.Label>
          <Input {...register("axleWidth", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.axleWidth?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.penDistanceFromAxle}>
          <Field.Label>Pen Distance</Field.Label>
          <Input {...register("penDistanceFromAxle", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.penDistanceFromAxle?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.penOffsetFromCenterline}>
          <Field.Label>Pen Offset</Field.Label>
          <Input {...register("penOffsetFromCenterline", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.penOffsetFromCenterline?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.deadband}>
          <Field.Label>Motor Lash</Field.Label>
          <Input {...register("deadband", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.deadband?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.startX}>
          <Field.Label>Start X</Field.Label>
          <Input {...register("startX", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.startX?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.startY}>
          <Field.Label>Start Y</Field.Label>
          <Input {...register("startY", { valueAsNumber: true })} />
          <Field.ErrorText>{errors.startY?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit">Submit</Button>
      </Stack>
    </form>
};
