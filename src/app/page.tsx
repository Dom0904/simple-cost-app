"use client";

import ProductEstimateCalculator from "../components/calculator/ProductEstimateCalculator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Product Cost Calculator
        </h1>
        <ProductEstimateCalculator />
      </div>
    </main>
  );
}
