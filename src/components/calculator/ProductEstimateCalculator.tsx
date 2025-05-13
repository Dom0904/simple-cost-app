"use client"

import { useState } from "react"
import { Calculator, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Material options for the calculator
const materialOptions = [
  { id: "m1", name: "Aluminum", costPerUnit: 5.75 },
  { id: "m2", name: "Steel", costPerUnit: 3.25 },
  { id: "m3", name: "Plastic", costPerUnit: 1.5 },
  { id: "m4", name: "Wood", costPerUnit: 2.8 },
  { id: "m5", name: "Glass", costPerUnit: 4.5 },
  { id: "m6", name: "Fabric", costPerUnit: 6.25 },
  { id: "m7", name: "Copper", costPerUnit: 8.75 },
  { id: "m8", name: "Rubber", costPerUnit: 3.0 },
]

interface Material {
  id: string
  name: string
  quantity: number
  costPerUnit: number
  totalCost: number
}

interface Labor {
  description: string
  hours: number
  ratePerHour: number
  totalCost: number
}

export function ProductEstimateCalculator() {
  const [productName, setProductName] = useState("")
  const [materials, setMaterials] = useState<Material[]>([])
  const [labor, setLabor] = useState<Labor[]>([{ description: "Assembly", hours: 2, ratePerHour: 25, totalCost: 50 }])
  const [overheadRate, setOverheadRate] = useState(15)
  const [profitMargin, setProfitMargin] = useState(25)

  // Calculate totals
  const materialCost = materials.reduce((sum, item) => sum + item.totalCost, 0)
  const laborCost = labor.reduce((sum, item) => sum + item.totalCost, 0)
  const subtotal = materialCost + laborCost
  const overheadCost = subtotal * (overheadRate / 100)
  const totalCost = subtotal + overheadCost
  const profit = totalCost * (profitMargin / 100)
  const finalPrice = totalCost + profit

  // Add a new material
  const addMaterial = () => {
    const defaultMaterial = materialOptions[0]
    const newMaterial: Material = {
      id: defaultMaterial.id,
      name: defaultMaterial.name,
      quantity: 1,
      costPerUnit: defaultMaterial.costPerUnit,
      totalCost: defaultMaterial.costPerUnit,
    }
    setMaterials([...materials, newMaterial])
  }

  // Update material
  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updatedMaterials = [...materials]

    if (field === "id") {
      const selectedMaterial = materialOptions.find((m) => m.id === value)
      if (selectedMaterial) {
        updatedMaterials[index].id = value
        updatedMaterials[index].name = selectedMaterial.name
        updatedMaterials[index].costPerUnit = selectedMaterial.costPerUnit
        updatedMaterials[index].totalCost = selectedMaterial.costPerUnit * updatedMaterials[index].quantity
      }
    } else if (field === "quantity") {
      updatedMaterials[index].quantity = value
      updatedMaterials[index].totalCost = updatedMaterials[index].costPerUnit * value
    }

    setMaterials(updatedMaterials)
  }

  // Remove material
  const removeMaterial = (index: number) => {
    const updatedMaterials = [...materials]
    updatedMaterials.splice(index, 1)
    setMaterials(updatedMaterials)
  }

  // Add labor
  const addLabor = () => {
    const newLabor: Labor = {
      description: "Labor",
      hours: 1,
      ratePerHour: 25,
      totalCost: 25,
    }
    setLabor([...labor, newLabor])
  }

  // Update labor
  const updateLabor = (index: number, field: keyof Labor, value: any) => {
    const updatedLabor = [...labor]

    updatedLabor[index][field] = value

    if (field === "hours" || field === "ratePerHour") {
      updatedLabor[index].totalCost = updatedLabor[index].hours * updatedLabor[index].ratePerHour
    }

    setLabor(updatedLabor)
  }

  // Remove labor
  const removeLabor = (index: number) => {
    const updatedLabor = [...labor]
    updatedLabor.splice(index, 1)
    setLabor(updatedLabor)
  }

  // Export estimate
  const exportEstimate = () => {
    const estimate = {
      productName,
      materials,
      labor,
      overheadRate,
      profitMargin,
      materialCost,
      laborCost,
      subtotal,
      overheadCost,
      totalCost,
      profit,
      finalPrice,
    }

    const blob = new Blob([JSON.stringify(estimate, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${productName || "product"}-estimate.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="calculator">Calculator</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>

      <TabsContent value="calculator">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Enter the basic information about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Materials</CardTitle>
                <CardDescription>Add materials needed for production</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addMaterial}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {materials.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No materials added. Click "Add" to add materials.
                </div>
              ) : (
                materials.map((material, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Select
                        value={material.id}
                        onValueChange={(value) => updateMaterial(index, "id", value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => removeMaterial(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(index, "quantity", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cost per Unit</Label>
                        <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted">
                          ${material.costPerUnit.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Cost</Label>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted">
                        ${material.totalCost.toFixed(2)}
                      </div>
                    </div>
                    {index < materials.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </CardContent>
            {materials.length > 0 && (
              <CardFooter>
                <div className="w-full text-right">
                  <p className="text-sm text-muted-foreground">
                    Total Materials Cost: ${materialCost.toFixed(2)}
                  </p>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Labor</CardTitle>
                <CardDescription>Add labor costs for production</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addLabor}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {labor.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Labor description"
                      value={item.description}
                      onChange={(e) => updateLabor(index, "description", e.target.value)}
                      className="max-w-[180px]"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeLabor(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`hours-${index}`}>Hours</Label>
                      <Input
                        id={`hours-${index}`}
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={item.hours}
                        onChange={(e) => updateLabor(index, "hours", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`rate-${index}`}>Rate per Hour ($)</Label>
                      <Input
                        id={`rate-${index}`}
                        type="number"
                        min="1"
                        value={item.ratePerHour}
                        onChange={(e) => updateLabor(index, "ratePerHour", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Cost</Label>
                    <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted">
                      ${item.totalCost.toFixed(2)}
                    </div>
                  </div>
                  {index < labor.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <div className="w-full text-right">
                <p className="text-sm text-muted-foreground">
                  Total Labor Cost: ${laborCost.toFixed(2)}
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="summary">
        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
            <CardDescription>Overview of all costs and final price</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Overhead Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={overheadRate}
                onChange={(e) => setOverheadRate(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Profit Margin (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Materials Cost:</span>
                <span>${materialCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor Cost:</span>
                <span>${laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead ({overheadRate}%):</span>
                <span>${overheadCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit ({profitMargin}%):</span>
                <span>${profit.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Final Price:</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={exportEstimate}>
              <Calculator className="mr-2 h-4 w-4" />
              Export Estimate
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
