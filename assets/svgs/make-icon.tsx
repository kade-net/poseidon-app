import { ReactElement } from "react";

export interface IconProps {
    color?: string;
    size?: number;
}

export default function makeIcon<P extends IconProps = IconProps>(
    name: string,
    callback: (props: P) => ReactElement,
) {
    const IconComponent = (props: P) =>
        callback({
            ...props,
            color: props.color ?? undefined,
        });
    IconComponent.displayName = name;
    return IconComponent;
}
