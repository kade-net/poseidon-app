import React from "react";
import Svg, { G, Path } from "react-native-svg";
import makeIcon from "./make-icon";

export default makeIcon("CoreLineNotificationIcon", ({ color, size = 35 }) => (
    <Svg
        fill="none"
        viewBox="0 0 14 14"
        id="Ringing-Bell-Notification--Streamline-Core"
        height={size}
        width={size}
    >
        <G id="ringing-bell-notification--notification-vibrate-ring-sound-alarm-alert-bell-noise">
            <Path
                id="Vector"
                stroke={color ?? "#000000"}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5h2"
                strokeWidth="1"
            />
            <Path
                id="Vector_2"
                stroke={color ?? "#000000"}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 6.25c0 -1.06087 -0.4214 -2.07828 -1.17157 -2.82843C9.07828 2.67143 8.06087 2.25 7 2.25s-2.07828 0.42143 -2.82843 1.17157C3.42143 4.17172 3 5.18913 3 6.25v3.5c0 0.3978 -0.15804 0.7794 -0.43934 1.0607S1.89782 11.25 1.5 11.25h11c-0.3978 0 -0.7794 -0.158 -1.0607 -0.4393S11 10.1478 11 9.75v-3.5Z"
                strokeWidth="1"
            />
            <Path
                id="Vector_3"
                stroke={color ?? "#000000"}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M0.5 5.37c0.000539 -0.95186 0.227534 -1.88993 0.66224 -2.73673C1.59694 1.78647 2.22687 1.05525 3 0.5"
                strokeWidth="1"
            />
            <Path
                id="Vector_4"
                stroke={color ?? "#000000"}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 5.37c-0.0005 -0.95186 -0.2275 -1.88993 -0.6622 -2.73673S11.7731 1.05525 11 0.5"
                strokeWidth="1"
            />
        </G>
    </Svg>
));
