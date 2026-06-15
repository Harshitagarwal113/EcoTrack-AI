import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCarbonFootprint, fetchEmissionFactors } from "@/features/carbon/services/carbon-calculation.service";
import type { CalculatorInput } from "@/types";
import { EmissionFactors } from "@/services/carbon/emissionService";

export function useCarbonTracker() {
  const queryClient = useQueryClient();
  
  const { data: factors } = useQuery({
    queryKey: ['emissionFactors'],
    queryFn: fetchEmissionFactors,
    staleTime: Infinity, // Emission factors rarely change
  });
  
  const [formData, setFormData] = useState<CalculatorInput>({
    transportation: { car: 0, bus: 0, train: 0, metro: 0, bike: 0, walking: 0 },
    energy: { electricity: 0, acUsage: 0 },
    food: "Mixed Diet",
    shopping: { electronics: 0, clothing: 0, generalPurchases: 0 },
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentTotal = useMemo(() => {
    if (!factors) return 0;
    
    let total = 0;
    total += formData.transportation.car * factors.car;
    total += formData.transportation.bus * factors.bus;
    total += formData.transportation.train * factors.train;
    total += formData.transportation.metro * factors.metro;
    total += formData.transportation.bike * factors.bike;
    total += formData.transportation.walking * factors.walking;
    
    total += formData.energy.electricity * factors.electricity;
    total += formData.energy.acUsage * factors.acUsage;
    
    if (formData.food === "Vegetarian") total += factors.vegetarian;
    if (formData.food === "Mixed Diet") total += factors.mixedDiet;
    if (formData.food === "Non-Vegetarian") total += factors.nonVegetarian;

    total += formData.shopping.electronics * factors.electronics;
    total += formData.shopping.clothing * factors.clothing;
    total += formData.shopping.generalPurchases * factors.generalPurchases;
    
    return total;
  }, [formData, factors]);

  const currentGrade = useMemo(() => {
    if (currentTotal < 5) return "A";
    if (currentTotal < 10) return "B";
    if (currentTotal < 20) return "C";
    return "D";
  }, [currentTotal]);

  const handleNumChange = useCallback((category: keyof CalculatorInput, field: string, value: string) => {
    const num = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: num,
      },
    }));
  }, []);

  const saveMutation = useMutation({
    mutationFn: () => saveCarbonFootprint(formData),
    onSuccess: (res) => {
      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Invalidate streaks and history to instantly reflect the new entry on Dashboard and History pages
        queryClient.invalidateQueries({ queryKey: ['streaks'] });
        queryClient.invalidateQueries({ queryKey: ['badges'] });
        queryClient.invalidateQueries({ queryKey: ['history'] });
      } else {
        alert("Error saving: " + res.error);
      }
    }
  });

  const handleSave = useCallback(async () => {
    setSubmitSuccess(false);
    saveMutation.mutate();
  }, [saveMutation]);

  return {
    factors,
    formData,
    setFormData,
    isSubmitting: saveMutation.isPending,
    submitSuccess,
    currentTotal,
    currentGrade,
    handleNumChange,
    handleSave
  };
}
