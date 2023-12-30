export interface Service {
  id?: string,
  serviceAt?: Date,
  context?: string,
  serviceAnd?: Date,
  status?: boolean,
  person?: {
    name?: string,
    cpf?: string,
    phone?: string,
    adress?: {
      city?: string,
      state?: string,
      postalCode?: string,
    }
  }
}
