import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import makeIcon from "./make-icon";

export default makeIcon("TipIcon", ({ color = "#FFEB3B", size = 24 }) => (
    <Svg
        fill="none"
        viewBox="0 0 14 14"
        id="Coin-Diagonal--Streamline-Core"
        height={size}
        width={size}
    >
        <G id="coin-diagonal">
            <Path
                id="Ellipse 1742"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.0992 1.83463c1.5215 1.52147 0.9048 4.60496 -1.3774 6.88717 -2.28221 2.2822 -5.3657 2.8989 -6.88717 1.3774C0.313164 8.57776 0.929861 5.49427 3.21207 3.21207 5.49427 0.929861 8.57776 0.313164 10.0992 1.83463Z"
                strokeWidth="1"
            />
            <Path
                id="Vector"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.788 10.7879c2.2822 -2.28217 2.8989 -5.36565 1.3774 -6.88712l-2.0661 -2.06615c1.5214 1.52147 0.9047 4.60496 -1.37748 6.88716 -2.2822 2.28221 -5.36569 2.89891 -6.88716 1.37741l2.06615 2.0662c1.52147 1.5214 4.60495 0.9047 6.88719 -1.3775Z"
                strokeWidth="1"
            />
            <Path
                id="Vector 3453"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.7218 8.7218 2.0662 2.0662"
                strokeWidth="1"
            />
            <Path
                id="Vector_2"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.79413 10.6151 2.06615 2.0661"
                strokeWidth="1"
            />
            <Path
                id="Vector_3"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.6151 5.79407 2.0662 2.06615"
                strokeWidth="1"
            />
        </G>
    </Svg>
));
