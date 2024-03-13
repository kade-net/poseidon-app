import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList, Platform } from "react-native";

export const useMultiScrollManager = (routes: { key: string; title: string }[], sizing: number) => {
    const CBTabViewOffset = Platform.OS === 'ios' ? sizing : 0;
    const scrollY = useRef(new Animated.Value(-sizing)).current;
    const [index, setIndex] = useState(0);
    const isListGliding = useRef(false);
    const tabkeyToScrollPosition = useRef<{ [key: string]: number }>({}).current;
    const tabkeyToScrollableChildRef = useRef<{ [key: string]: FlatList }>({})
        .current;

    useEffect(() => {
        const listener = scrollY.addListener(({ value }) => {
            const curRoute = routes[index].key;
            tabkeyToScrollPosition[curRoute] = value;
        });
        return () => {
            scrollY.removeListener(listener);
        };
    }, [index, scrollY, routes, tabkeyToScrollPosition]);

    return useMemo(() => {
        const syncScrollOffset = () => {
            const curRouteKey = routes[index].key;
            const scrollValue = tabkeyToScrollPosition[curRouteKey];

            Object.keys(tabkeyToScrollableChildRef).forEach((key) => {
                const scrollRef = tabkeyToScrollableChildRef[key];
                if (!scrollRef) {
                    return;
                }

                if (/* header visible */ key !== curRouteKey) {
                    if (scrollValue <= CBTabViewOffset + sizing) {
                        scrollRef.scrollToOffset({
                            offset: Math.max(
                                Math.min(scrollValue, CBTabViewOffset + sizing),
                                CBTabViewOffset,
                            ),
                            animated: false,
                        });
                        tabkeyToScrollPosition[key] = scrollValue;
                    } else if (
                        /* header hidden */
                        tabkeyToScrollPosition[key] <
                        CBTabViewOffset + sizing ||
                        tabkeyToScrollPosition[key] == null
                    ) {
                        scrollRef.scrollToOffset({
                            offset: CBTabViewOffset + sizing,
                            animated: false,
                        });
                        tabkeyToScrollPosition[key] =
                            CBTabViewOffset + sizing;
                    }
                }
            });
        };

        const onMomentumScrollBegin = () => {
            isListGliding.current = true;
        };

        const onMomentumScrollEnd = () => {
            isListGliding.current = false;
            syncScrollOffset();
        };

        const onScrollEndDrag = () => {
            syncScrollOffset();
        };

        const trackRef = (key: string, ref: FlatList) => {
            tabkeyToScrollableChildRef[key] = ref;
        };

        const getRefForKey = (key: string) => tabkeyToScrollableChildRef[key];

        return {
            scrollY,
            onMomentumScrollBegin,
            onMomentumScrollEnd,
            onScrollEndDrag,
            trackRef,
            index,
            setIndex,
            getRefForKey,
        };
    }, [
        index,
        routes,
        scrollY,
        tabkeyToScrollPosition,
        tabkeyToScrollableChildRef,
    ]);
};