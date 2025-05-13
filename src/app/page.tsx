import { ProductEstimateCalculator } from "@/components/calculator/ProductEstimateCalculator"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-center mb-8">Product Cost Calculator</h1>
        <div className="w-full max-w-5xl">
          <ProductEstimateCalculator />
        </div>
      </div>
    </main>
  )
} 