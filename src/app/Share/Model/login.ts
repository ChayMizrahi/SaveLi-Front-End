export class Login {
    
    public email: string;
    public password: string;
    public loginType: string;
   
    constructor(email?: string, password?: string, loginType?: string) {
        this.email = email;
        this.password = password;
        this.loginType = "CUSTOMER";
    }
    
}