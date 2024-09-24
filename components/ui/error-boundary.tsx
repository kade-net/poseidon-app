import React from 'react';
import posti from "../../lib/posti";

export class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        posti.capture('render error', {
            error: error,
            componentStack: info.componentStack
        })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}