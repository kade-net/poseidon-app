import React from "react"

interface Props {
    defaultIsOpen?: boolean
}
export default function useDisclosure(props?: Props) {
    const [isOpen, setIsOpen] = React.useState(props?.defaultIsOpen ?? false)
    const onOpen = React.useCallback(() => setIsOpen(true), [])
    const onClose = React.useCallback(() => setIsOpen(false), [])
    const onToggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
    return {
        isOpen,
        onOpen,
        onClose,
        onToggle
    }
}