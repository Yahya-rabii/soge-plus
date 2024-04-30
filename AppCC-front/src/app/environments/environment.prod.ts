export const environment = {
    production: true,
    
    // auth microservice

    AuthapiUrl: 'http://minikube-gateway.socgen.com/auth-service',
    loginEndpoint: '/login',
    logoutEndpoint: '/logout',
    signupEndpoint: '/signup',
    refreshEndpoint: '/refresh',
    getRolesEndpoint: '/role',


    // client microservice

    ClientMsUrl: 'http://minikube-gateway.socgen.com/client-service',
    getAllclientsEndpoint: '/clients',
    getClientByIdEndpoint: '/client/',
    createClientEndpoint: '/addClient',
    updateClientEndpoint: '/updateClient/',
    deleteClientEndpoint: '/deleteClient/',
    getcontractsByClientIdEndpoint: '/contracts/',


    // loan microservice

    LoanMsUrl: 'http://minikube-gateway.socgen.com/loan-service',
    getAllLoansEndpoint: '/loans',
    getLoanByIdEndpoint: '/loan/',
    createLoanEndpoint: '/createLoan',
    updateLoanEndpoint: '/updateLoan/',
    deleteLoanEndpoint: '/deleteLoan/',
    getLoansByClientIdEndpoint: '/loanByClientId/',
    validateLoanEndpoint: '/validateLoan/',
    rejectLoanEndpoint: '/rejectLoan/',

    // contract microservice

    ContractMsUrl: 'http://minikube-gateway.socgen.com/contract-service',
    getAllContractsEndpoint: '/contracts',
    getContractByIdEndpoint: '/contract/',
    createContractEndpoint: '/createContract',
    updateContractEndpoint: '/updateContract/',
    deleteContractEndpoint: '/deleteContract/',
    getContractsOfClientEndpoint: '/contracts/client/',
    signContractEndpoint: '/signContract/',
    verifySecretEndpoint: '/verifySecret/',


    // Account microservice
    AccountMsUrl: 'http://minikube-gateway.socgen.com/account-service',
    getAllAccountsEndpoint: '/Accounts',
    getAccountByIdEndpoint: '/Account/',
    createAccountEndpoint: '/createAccount',
    updateAccountEndpoint: '/updateAccount/',
    deleteAccountEndpoint: '/deleteAccount/',
    getAccountByAccountHolderIdEndpoint: '/Accounts/client/',
    getBeneficiariesEndpoint: '/beneficiaries/',
    addBeneficiaryEndpoint: '/beneficiary/',
    addTransactionEndpoint: '/addTransaction/',
    getTransactionsEndpoint: '/transactions/',
  };


  
