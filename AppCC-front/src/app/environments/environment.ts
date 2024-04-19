export const environment = {
    production: false,
    
    // auth microservice

    AuthapiUrl: 'http://localhost:8888/auth-service',
    loginEndpoint: '/login',
    logoutEndpoint: '/logout',
    signupEndpoint: '/signup',
    refreshEndpoint: '/refresh',
    getRolesEndpoint: '/role',


    // client microservice

    ClientMsUrl: 'http://localhost:8888/client-service',
    getAllclientsEndpoint: '/clients',
    getClientByIdEndpoint: '/client/',
    createClientEndpoint: '/addClient',
    updateClientEndpoint: '/updateClient/',
    deleteClientEndpoint: '/deleteClient/',
    getcontractsByClientIdEndpoint: '/contracts/',


    // loan microservice

    LoanMsUrl: 'http://localhost:8888/loan-service',
    getAllLoansEndpoint: '/loans',
    getLoanByIdEndpoint: '/loan/',
    createLoanEndpoint: '/createLoan',
    updateLoanEndpoint: '/updateLoan/',
    deleteLoanEndpoint: '/deleteLoan/',
    getLoansByClientIdEndpoint: '/loanByClientId/',
    validateLoanEndpoint: '/validateLoan/',
    rejectLoanEndpoint: '/rejectLoan/',

    // contract microservice

    ContractMsUrl: 'http://localhost:8888/contract-service',
    getAllContractsEndpoint: '/contracts',
    getContractByIdEndpoint: '/contract/',
    createContractEndpoint: '/createContract',
    updateContractEndpoint: '/updateContract/',
    deleteContractEndpoint: '/deleteContract/',
    getContractsOfClientEndpoint: '/contracts/client/',


    // Account microservice
    AccountMsUrl: 'http://localhost:8888/account-service',
    getAllAccountsEndpoint: '/Accounts',
    getAccountByIdEndpoint: '/Account/',
    createAccountEndpoint: '/createAccount',
    updateAccountEndpoint: '/updateAccount/',
    deleteAccountEndpoint: '/deleteAccount/',
    getAccountByAccountHolderIdEndpoint: '/Accounts/client/',
    getBeneficiariesEndpoint: '/beneficiaries/',
    addBeneficiaryEndpoint: '/beneficiary/',

  };


  