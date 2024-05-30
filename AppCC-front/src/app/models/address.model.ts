export class Address {
  street: string | '';
  city: string | '';
  postalCode: number | 0;
  country: string | '';
  constructor(
    street: string,
    city?: string,
    postalCode?: number,
    country?: string,
  ) {
    this.street = street || '';
    this.city = city || '';
    this.postalCode = postalCode || 0;
    this.country = country || '';
  }
  getStreet(): string {
    return this.street;
  }
  setStreet(street: string): void {
    this.street = street;
  }
  getCity(): string {
    return this.city;
  }
  setCity(city: string): void {
    this.city = city;
  }
  getPostalCode(): number {
    return this.postalCode;
  }
  setPostalCode(postalCode: number): void {
    this.postalCode = postalCode;
  }
  getCountry(): string {
    return this.country;
  }
  getAttributes(): Address {
    return new Address(this.street, this.city, this.postalCode, this.country);
  }
  setAttributes(
    street: string,
    city: string,
    postalCode: number,
    country: string,
  ): void {
    this.street = street;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
  }
}
