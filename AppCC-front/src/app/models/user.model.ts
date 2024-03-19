export class User {

    ID : string | '';
    Username! : string | '';
    Email!: string | '';
    IsAdmin!: boolean | false;
    
    constructor(Id? : string , Username? : string, Email? : string, IsAdmin? : boolean) {
        this.ID = Id || '' ;
        this.Username = Username || '';
        this.Email = Email || '';
        this.IsAdmin = IsAdmin || false;
    }
    
    
    public get_attributes() : string {
        return this.Email + ' ' + this.IsAdmin;
    }
    }