import { Plan } from "./types"

export const getPlans = async (): Promise<Plan[]> => {
  const response = await fetch("/api/plans", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch plans")
  }

  return response.json()
}
