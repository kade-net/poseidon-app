import { useCallback, useMemo } from "react";
import { TPUBLICATION } from "../../../schema";
import {ScrollView, XStack, YStack} from "tamagui";
import Image from "../../ui/feed/image";
import VideoViewer from "./video";
import Removable from "./removable";
import {FlatList} from "react-native";

function getLayout(data: TPUBLICATION["media"]) {
    if (data?.length === 1) {
        return "single";
    } else if (data?.length === 2) {
        return "double";
    } else if (data?.length === 3) {
        return "triple";
    } else if (data?.length === 4 || (data?.length ?? 0) > 4) {
        return "quad";
    }
    return "none";
}

export default function GenerateLayout(props: { data: TPUBLICATION["media"], editable?: boolean, onRemove?: (id: string) => void, layout?: 'horizontal' | 'single' | 'double' | 'quad' | 'triple' }) {
    const { data, editable, onRemove, layout: chosenLayout } = props;

    const layout = useMemo(() => chosenLayout ?? getLayout(data), [data?.length]);

    const component = useCallback(() => {
        switch (layout) {
            case "single": {
                const [first] = data ?? [];
                return (
                    <YStack flex={1} width={"100%"} height={"100%"}>
                        {first?.type === "image" ? (
                            <Removable
                                removable={editable}
                                id={'0'}
                                onRemove={onRemove}
                            >
                                <Image preventExpand={editable} image={first.url} />
                            </Removable>
                        ) : (
                            <Removable
                                removable={editable}
                                id={'0'}
                                onRemove={onRemove}
                            >
                                <VideoViewer data={first} />
                            </Removable>
                        )}
                    </YStack>
                );
            }
            case "double": {
                const [first, second] = data ?? [];
                return (
                    <XStack w="100%" borderRadius={10}>
                        <XStack flex={1} overflow="hidden">
                            {first?.type === "image" ? (
                                <Removable
                                    removable={editable}
                                    id={'0'}
                                    onRemove={onRemove}
                                >

                                    <Image preventExpand={editable} prefferedAspectRatio={1} image={first.url} />
                                </Removable>
                            ) : (
                                <Removable
                                    removable={editable}
                                    id={'0'}
                                    onRemove={onRemove}
                                >
                                    <VideoViewer data={first} />
                                </Removable>
                            )}
                        </XStack>
                        <YStack h="100%" p={5} />
                        <XStack flex={1} overflow="hidden">
                            {second?.type === "image" ? (
                                <Removable
                                    removable={editable}
                                    id={'1'}
                                    onRemove={onRemove}
                                >

                                    <Image preventExpand={editable} prefferedAspectRatio={1} image={second.url} />
                                </Removable>
                            ) : (
                                <Removable
                                    removable={editable}
                                    id={'1'}
                                    onRemove={onRemove}
                                >

                                    <VideoViewer data={second} />
                                </Removable>
                            )}
                        </XStack>
                    </XStack>
                );
            }
            case "triple": {
                const [first, second, third] = data ?? [];
                return (
                    <YStack w="100%">
                        <XStack w="100%">
                            <XStack flex={1} >
                                {first?.type === "image" ? (
                                    <Removable
                                        removable={editable}
                                        id={'0'}
                                        onRemove={onRemove}
                                    >

                                        <Image preventExpand={editable} prefferedAspectRatio={1} image={first.url} />
                                    </Removable>
                                ) : (
                                    <Removable
                                        removable={editable}
                                        id={'0'}
                                        onRemove={onRemove}
                                    >

                                        <VideoViewer data={first} />
                                    </Removable>
                                )}
                            </XStack>
                            <YStack h="100%" p={5} />
                            <XStack flex={1} >
                                {second?.type === "image" ? (
                                    <Removable
                                        removable={editable}
                                        id={'1'}
                                        onRemove={onRemove}
                                    >

                                        <Image preventExpand={editable} prefferedAspectRatio={1} image={second.url} />
                                    </Removable>
                                ) : (
                                    <Removable
                                        removable={editable}
                                        id={'1'}
                                        onRemove={onRemove}
                                    >
                                        <VideoViewer data={second} />
                                    </Removable>
                                )}
                            </XStack>
                        </XStack>
                        <XStack w="100%" p={5} />
                        <XStack w="100%">
                            {third?.type === "image" ? (
                                <Removable
                                    removable={editable}
                                    id={'2'}
                                    onRemove={onRemove}
                                >

                                    <Image preventExpand={editable} image={third.url} />
                                </Removable>
                            ) : (
                                <Removable
                                    removable={editable}
                                    id={'2'}
                                    onRemove={onRemove}
                                >

                                    <VideoViewer data={third} />
                                </Removable>
                            )}
                        </XStack>
                    </YStack>
                );
            }
            case "quad": {
                const [first, second, third, fourth] = data ?? [];
                return (
                    <YStack w="100%" flex={1} >
                        <XStack w="100%" flex={1} >
                            <XStack flex={1} >
                                {first?.type === "image" ? (
                                    <Removable
                                        removable={editable}
                                        id={'0'}
                                        onRemove={onRemove}
                                    >

                                        <Image preventExpand={editable} prefferedAspectRatio={1} image={first.url} />
                                    </Removable>
                                ) : (
                                    <Removable
                                        removable={editable}
                                        id={'0'}
                                        onRemove={onRemove}
                                    >

                                        <VideoViewer data={first} />
                                    </Removable>
                                )}
                            </XStack>
                            <YStack h="100%" p={5} />
                            <XStack flex={1} >
                                {second?.type === "image" ? (
                                    <Removable
                                        removable={editable}
                                        id={'1'}
                                        onRemove={onRemove}
                                    >
                                        <Image preventExpand={editable} prefferedAspectRatio={1} image={second.url} />
                                    </Removable>
                                ) : (
                                    <Removable
                                        removable={editable}
                                        id={'1'}
                                        onRemove={onRemove}
                                    >

                                        <VideoViewer data={second} />
                                    </Removable>
                                )}
                            </XStack>
                        </XStack>
                        <XStack w="100%" p={5} />
                        <XStack w="100%" justifyContent="space-between" flex={1} >
                            <XStack flex={1} >
                                {third?.type === "image" ? (
                                    <Removable
                                        removable={editable}
                                        id={'2'}
                                        onRemove={onRemove}
                                    >

                                        <Image preventExpand={editable} prefferedAspectRatio={1} image={third.url} />
                                    </Removable>
                                ) : (
                                    <Removable
                                        removable={editable}
                                        id={'2'}
                                        onRemove={onRemove}
                                    >

                                        <VideoViewer data={third} />
                                    </Removable>
                                )}
                            </XStack>
                            <YStack h="100%" p={5} />
                            <XStack flex={1} >
                                {fourth?.type === "image" ? (
                                    <Removable
                                        removable={editable}
                                        id={'3'}
                                        onRemove={onRemove}
                                    >

                                        <Image preventExpand={editable} prefferedAspectRatio={1} image={fourth.url} />
                                    </Removable>
                                ) : (
                                    <Removable
                                        removable={editable}
                                        id={'3'}
                                        onRemove={onRemove}
                                    >
                                        <VideoViewer data={fourth} />
                                    </Removable>
                                )}
                            </XStack>
                        </XStack>
                    </YStack>
                );
            }
            case "horizontal": {
                return (
                    <XStack w={"100%"} flex={1} >
                        <ScrollView style={{
                            width: '100%',
                            height: '100%',
                        }} showsHorizontalScrollIndicator={false} horizontal columnGap={10} >
                            {
                                data?.map((item, index)=>{
                                    return (
                                        <XStack key={item.url} style={{flex: 1, height: '100%'}} p={10} >
                                            <Removable
                                                id={`${index}`}
                                                removable={editable}
                                                onRemove={onRemove}
                                            >
                                                {
                                                    item.type == 'image' ? <Image preventExpand={editable} image={item.url} /> :
                                                        <VideoViewer data={item} />
                                                }
                                            </Removable>
                                        </XStack>
                                    )
                                })
                            }
                        </ScrollView>
                    </XStack>
                )
            }
            default: {
                return null;
            }
        }
    }, [layout, data?.length]);

    return component();
}
