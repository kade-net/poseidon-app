import React, { ReactNode } from "react";
import { Text } from "tamagui";

class ErrorBoundary extends React.Component<{ children: ReactNode }> {

    state: { hasError: boolean; } = { hasError: false };
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return <Text>Something went wrong.</Text>;
        }
        return this.props?.children;
    }
}

export default ErrorBoundary;