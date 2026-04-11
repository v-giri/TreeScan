import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 p-6">
          <span className="text-5xl">🌿</span>
          <h2 className="font-serif text-lg text-plant-dark text-center">Something went wrong</h2>
          <p className="text-xs text-plant-light text-center">{this.state.error?.message}</p>
          <button
            onClick={this.handleReset}
            className="bg-sage-deep text-white text-sm font-semibold rounded-full px-6 py-2.5"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
