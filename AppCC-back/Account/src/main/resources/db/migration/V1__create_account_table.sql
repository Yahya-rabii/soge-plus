/*
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Type accountType;

    private String accountHolderId;

    private BigInteger accountHolderRIB;

    private Double balance = 0.0;

    @ElementCollection
    private List<String> beneficiariesIds;



*/

CREATE TABLE IF NOT EXISTS `account` (
                                        `id` varchar(50) NOT NULL PRIMARY KEY,
                                        `account_type` varchar(50) NOT NULL,
                                        `account_holder_id` varchar(50) NOT NULL,
                                        `account_holder_rib` varchar(255) NOT NULL,
                                        `balance` DOUBLE NOT NULL,
                                        `beneficiaries_ids` JSON

);
