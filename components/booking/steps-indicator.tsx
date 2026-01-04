interface StepsIndicatorProps {
  currentStep: number
  steps: string[]
}

export function StepsIndicator({ currentStep, steps }: StepsIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          {/* Step Circle */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${
              index < currentStep
                ? "bg-primary text-primary-foreground"
                : index === currentStep
                  ? "bg-accent text-accent-foreground ring-2 ring-accent"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>

          {/* Step Label */}
          <p
            className={`ml-3 font-semibold text-sm transition-colors ${
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {step}
          </p>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 rounded transition-colors ${index < currentStep ? "bg-primary" : "bg-muted"}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
