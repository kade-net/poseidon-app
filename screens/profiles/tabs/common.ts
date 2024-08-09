import { Animated, FlatList } from "react-native";
import { SceneRendererProps } from "react-native-tab-view";


export interface SceneProps extends SceneRendererProps {
    route: {
        key: string;
        title: string;
    };
}

export interface ProfileTabsProps extends SceneProps {
    manager: ScrollManager
    topSectionHeight: number
    address: string
}

export interface ScrollManager {
    scrollY: Animated.Value;
    onMomentumScrollBegin: () => void;
    onMomentumScrollEnd: () => void;
    onScrollEndDrag: () => void;
    trackRef: (key: string, ref: FlatList<any>) => void;
    index: number;
    setIndex: (index: number) => void;
    getRefForKey: (key: string) => FlatList<any> | undefined;
}