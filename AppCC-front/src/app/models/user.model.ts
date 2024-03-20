import { Credential } from "./credential.model";


export class User {

    username!: string | '';
    firstName!: string | '';
    lastName!: string | '';
    email!: string | '';
    
    // table of credential
    credentials!: Credential[] | undefined;

    constructor(
        username?: string,
        firstName?: string,
        lastName?: string,
        email?: string,
        credentials?: Credential[] | undefined
    ) {

        this.username = username || '';
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.email = email || '';
        this.credentials = credentials || undefined;
    }

    public get_attributes(): string {
        return this.username + ' ' + this.firstName + ' ' + this.lastName + ' ' + this.email;
    }


    public set_attributes( username: string, firstName: string, lastName: string, email: string, credentials: Credential[]): void {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.credentials = credentials;
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


}