export class Address {

    street: string | '';
    city: string | '';
    postalCode: string | '';
    country: string | '';


    constructor(
        street: string,
        city?: string,
        postalCode?: string,
        country?: string
    ) {
        this.street = street || '';
        this.city = city || '';
        this.postalCode = postalCode || '';
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

    getPostalCode(): string {
        return this.postalCode;
    }

    setPostalCode(postalCode: string): void {
        this.postalCode = postalCode;
    }

    getCountry(): string {
        return this.country;
    }

    getAttributes(): Address {
        return new Address(
            this.street,
            this.city,
            this.postalCode,
            this.country
        );
    }

    setAttributes( street: string, city: string, postalCode: string, country: string): void {
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
    }
}