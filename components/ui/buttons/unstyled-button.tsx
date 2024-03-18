import { ReactNode } from 'react'
import { Button } from 'tamagui'

const UnstyledButton = (props:{callback?: any,icon?: any, label: string, after?: boolean}) => {
    return(
        <Button
            onPress={props.callback}
            icon={props.after? null : props.icon}
            iconAfter={props.after? props.icon : null}
            backgroundColor={"$colourlessButton"}
            color="$text"
            fontSize={"$md"}
            unstyled={true}
            flexDirection='row'
            alignItems='center'
            marginBottom={10}
            marginTop={10}
        >
            {props.label}
        </Button>
    )
}

export default UnstyledButton;