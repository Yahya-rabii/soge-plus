import { Address } from "./address.model";
import { Credential } from "./credential.model";


export class User {

    username!: string | '';
    firstName!: string | '';
    lastName!: string | '';
    email!: string | '';

    
    // table of credential
    credentials!: Credential[] | undefined;
    address!: Address | undefined;

    constructor(
        username?: string,
        firstName?: string,
        lastName?: string,
        email?: string,
        credentials?: Credential[] | undefined,
        asdress?: Address | undefined
    ) {

        this.username = username || '';
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.email = email || '';
        this.credentials = credentials || undefined;
        this.address = asdress || undefined;
    }

    public get_attributes(): string {
        return this.username + ' ' + this.firstName + ' ' + this.lastName + ' ' + this.email;
    }


    public set_attributes( username: string, firstName: string, lastName: string, email: string, credentials: Credential[] , address: Address): void {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.credentials = credentials;
        this.address = address;
    }


   
    public get_username(): string {
        return this.username;
    }


    public get_first_name(): string {
        return this.firstName;
    }


    public get_last_name(): string {
        return this.lastName;
    }

    public get_email(): string {
        return this.email;
    }


    public get_credentials(): Credential[] | undefined {
        return this.credentials;
    }

    public get_address(): Address | undefined {
        return this.address?.getAttributes();
    }


    public set_username(username: string): void {
        this.username = username;
    }

    public set_first_name(firstName: string): void {
        this.firstName = firstName;
    }

    public set_last_name(lastName: string): void {
        this.lastName = lastName;
    }

    public set_email(email: string): void {
        this.email = email;
    }


    public set_credentials(credentials: Credential[]): void {
        this.credentials = credentials;
    }

    public set_address(address: Address): void {
        this.address?.setAttributes(address.getStreet(), address.getCity(), address.getPostalCode(), address.getCountry());
    }

}