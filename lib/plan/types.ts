export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  billingInterval: string
  description: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PlanState {
  plans: Plan[]
  isLoading: boolean
  error: string | null
}

export type PlanAction =
  | { type: "GET_PLANS"; payload: Plan[] }
  | { type: "GET_PLANS_ERROR"; payload: string }
  | { type: "GET_PLANS_LOADING"; payload: boolean }
