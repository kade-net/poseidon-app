

import React, { Component, ReactNode } from 'react';

interface ImageErrorBoundaryProps {
    fallback?: ReactNode;
    children?: ReactNode;
}

interface ImageErrorBoundaryState {
    hasError: boolean;
}

class ImageErrorBoundary extends Component<ImageErrorBoundaryProps, ImageErrorBoundaryState> {
    constructor(props: ImageErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ImageErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Image error caught in boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback image or message when error occurs
            return this.props.fallback
        }

        return this.props.children;
    }
}

export default ImageErrorBoundary;
