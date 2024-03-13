import React from "react";
import { Animated } from "react-native";


const profileScreenContext = React.createContext({
    scrollY: new Animated.Value(0),
    topSectionHeight: 0,
})