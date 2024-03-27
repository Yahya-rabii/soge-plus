export const environment = {
    production: false,
    AuthapiUrl: 'http://localhost:8888/AUTH-SERVICE',
    loginEndpoint: '/login',
    logoutEndpoint: '/logout',
    signupEndpoint: '/signup',
    refreshEndpoint: '/refresh',


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





  };


  