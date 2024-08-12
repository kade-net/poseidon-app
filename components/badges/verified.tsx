import { View, Text } from "react-native";
import React from "react";
import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

const VerifiedBadge = () => {
    return (
        <Svg style={{ borderRadius: 5, overflow: "hidden" }} width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <Rect width="24" height="24" fill="#4169E1" />
            <G clip-path="url(#clip0_26_55)">
                <Path d="M5.3916 15.4491C7.37646 17.0515 8.71541 19.1865 10.0346 21.3349C10.6764 22.3801 12.203 22.1362 12.5723 21.0033C14.4722 15.1761 16.5956 9.42442 18.938 3.7606C19.2247 3.06734 18.6279 2.23389 17.9683 2.05264C17.1703 1.83338 16.5481 2.32653 16.2603 3.02239C13.9179 8.68621 11.7945 14.4379 9.89464 20.2651L12.4324 19.9334C11.0008 17.6019 9.50851 15.2239 7.35516 13.4856C6.77219 13.015 5.96142 12.9158 5.3916 13.4856C4.9047 13.9725 4.80512 14.9757 5.3916 15.4491Z" fill="white" />
            </G>
            <Defs>
                <ClipPath id="clip0_26_55">
                    <Rect width="14.0235" height="20" fill="white" transform="translate(4.98822 2)" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default VerifiedBadge;
