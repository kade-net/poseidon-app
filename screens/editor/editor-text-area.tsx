import React, { memo } from "react";
import { UseFormReturn } from "react-hook-form";
import { TextArea } from "tamagui";
import { TPUBLICATION } from "../../schema";
import { Platform, TextInput } from "react-native";
import Highlight from "./highlight";

interface Props {
  form: UseFormReturn<TPUBLICATION, any, any>;
  onSelectionChange: (position: { start: number; end: number }) => void;
}

const EditorTextArea = React.forwardRef<TextInput, Props>((props, ref) => {
  const { form, onSelectionChange } = props;

  const CONTENT = form.watch("content") || "";
  const MENTIONS = form.watch("mentions") || {};

  return (
    <TextArea
      ref={ref}
      onChangeText={(v) => form.setValue("content", v)}
      onSelectionChange={(p) => {
        onSelectionChange(p.nativeEvent.selection);
      }}
      maxLength={320}
      backgroundColor={"$colorTransparent"}
      outlineWidth={0}
      borderWidth={0}
      placeholder={`What's happening?`}
      autoFocus
      width={"100%"}
      margin={0}
      padding={0}
      fontSize={18}
      fontWeight={"400"}
      verticalAlign={Platform.select({
        ios: undefined,
        android: "top",
      })}
    >
      <Highlight content={CONTENT} mentions={MENTIONS} />
    </TextArea>
  );
});

EditorTextArea.displayName = "EditorTextArea";

export default memo(EditorTextArea);
