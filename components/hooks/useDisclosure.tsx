import React from "react"


export default function useDisclosure() {
    const [isOpen, setIsOpen] = React.useState(false)
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