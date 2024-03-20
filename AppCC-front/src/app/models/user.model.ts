import { Credential } from "./credential.model";


export class User {

    username!: string | '';
    firstname!: string | '';
    lastname!: string | '';
    email!: string | '';
    
    // table of credential
    credentials!: Credential[] | undefined;

    constructor(
        username?: string,
        firstname?: string,
        lastname?: string,
        email?: string,
        credentials?: Credential[] | undefined
    ) {

        this.username = username || '';
        this.firstname = firstname || '';
        this.lastname = lastname || '';
        this.email = email || '';
        this.credentials = credentials || undefined;
    }

    public get_attributes(): string {
        return this.username + ' ' + this.firstname + ' ' + this.lastname + ' ' + this.email;
    }


    public set_attributes( username: string, firstname: string, lastname: string, email: string, credentials: Credential[]): void {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.credentials = credentials;
    }


   
    public get_username(): string {
        return this.username;
    }


    public get_first_name(): string {
        return this.firstname;
    }


    public get_last_name(): string {
        return this.lastname;
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

    public set_first_name(firstname: string): void {
        this.firstname = firstname;
    }

    public set_last_name(lastname: string): void {
        this.lastname = lastname;
    }

    public set_email(email: string): void {
        this.email = email;
    }


    public set_credentials(credentials: Credential[]): void {
        this.credentials = credentials;
    }


}