const GenericApiHost = 'http://localhost';
const GenericApiPort = '8888';
const GenericApiUrl = `${GenericApiHost}:${GenericApiPort}`;

export const environment = {
  production: true,
  // auth microservice
  AuthapiUrl: `${GenericApiUrl}/auth-service`, 
  loginEndpoint: '/login',
  logoutEndpoint: '/logout',
  signupEndpoint: '/signup',
  refreshEndpoint: '/refresh',
  getRolesEndpoint: '/role',
  validateSecretEndpoint: '/verifySecret/',
  // client microservice
  ClientMsUrl: `${GenericApiUrl}/client-service`,
  getAllclientsEndpoint: '/clients',
  getClientByIdEndpoint: '/client/',
  createClientEndpoint: '/addClient',
  updateClientEndpoint: '/updateClient/',
  deleteClientEndpoint: '/deleteClient/',
  getcontractsByClientIdEndpoint: '/contracts/',
  // loan microservice
  LoanMsUrl: `${GenericApiUrl}/loan-service`,
  getAllLoansEndpoint: '/loans',
  getLoanByIdEndpoint: '/loan/',
  createLoanEndpoint: '/createLoan',
  updateLoanEndpoint: '/updateLoan/',
  deleteLoanEndpoint: '/deleteLoan/',
  getLoansByClientIdEndpoint: '/loanByClientId/',
  validateLoanEndpoint: '/validateLoan/',
  rejectLoanEndpoint: '/rejectLoan/',
  // contract microservice
  ContractMsUrl: `${GenericApiUrl}/contract-service`,
  getAllContractsEndpoint: '/contracts',
  getContractByIdEndpoint: '/contract/',
  createContractEndpoint: '/createContract',
  updateContractEndpoint: '/updateContract/',
  deleteContractEndpoint: '/deleteContract/',
  getContractsOfClientEndpoint: '/contracts/client/',
  signContractEndpoint: '/signContract/',
  verifySecretEndpoint: '/verifySecret/',
  // Account microservice
  AccountMsUrl: `${GenericApiUrl}/account-service`,
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
