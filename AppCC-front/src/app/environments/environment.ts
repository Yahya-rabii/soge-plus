export const environment = {
    production: false,
    
    // auth microservice

    AuthapiUrl: 'http://localhost:8888/AUTH-SERVICE',
    loginEndpoint: '/login',
    logoutEndpoint: '/logout',
    signupEndpoint: '/signup',
    refreshEndpoint: '/refresh',
    getRolesEndpoint: '/role',


    // client microservice

    ClientMsUrl: 'http://localhost:8888/CLIENT-SERVICE',
    getAllclientsEndpoint: '/clients',
    getClientByIdEndpoint: '/client/',
    createClientEndpoint: '/addClient',
    updateClientEndpoint: '/updateClient/',
    deleteClientEndpoint: '/deleteClient/',
    getcontractsByClientIdEndpoint: '/contracts/',


    // loan microservice

    LoanMsUrl: 'http://localhost:8888/LOAN-SERVICE',
    getAllLoansEndpoint: '/loans',
    getLoanByIdEndpoint: '/loan/',
    createLoanEndpoint: '/createLoan',
    updateLoanEndpoint: '/updateLoan/',
    deleteLoanEndpoint: '/deleteLoan/',
    getLoansByClientIdEndpoint: '/loanByClientId/',


    // contract microservice

    ContractMsUrl: 'http://localhost:8888/CONTRACT-SERVICE',
    getAllContractsEndpoint: '/contracts',
    getContractByIdEndpoint: '/contract/',
    createContractEndpoint: '/createContract',
    updateContractEndpoint: '/updateContract/',
    deleteContractEndpoint: '/deleteContract/',
    getContractsOfClientEndpoint: '/contracts/client/',


  };


  