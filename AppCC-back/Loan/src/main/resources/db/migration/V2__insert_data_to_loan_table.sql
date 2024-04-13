-- insert fake data to loan table on startup
-- 1	2.1321321E7	2	1	0	FALSE	a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/d2f0cc23-66f8-435b-866a-d07b03156884.png	a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/01866372-eb66-4bd5-9155-de2005c9046b.png	a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/27427584-22c7-4384-bc51-19b50c08afc0.png	2312321312	3213213213DZEDZE	0	12321312323213321123		2024-04-01 10:05:00.797	a66e0c83-47bc-476a-8baf-acd71019dfc9

INSERT INTO loan (amount, type, payment_duration, status, approved, signature_file_name, cin_cart_recto_file_name, cin_cart_verso_file_name, cin_number, tax_id, reception_method, bank_account_credentials_rib, selected_agency, loan_creation_date, client_id)
VALUES ( 2222222, 2, 1, 0, FALSE, 'a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/d2f0cc23-66f8-435b-866a-d07b03156884.png', 'a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/01866372-eb66-4bd5-9155-de2005c9046b.png', 'a66e0c83-47bc-476a-8baf-acd71019dfc9/2024-04-01-10-05-00/27427584-22c7-4384-bc51-19b50c08afc0.png', 2312321312, '3213213213DZEDZE', 0, 12321312323213321123,'' ,'2024-04-01 10:05:00.797', 'a66e0c83-47bc-476a-8baf-acd71019dfc9');


-- 2	2312313.0	1	0	0	FALSE	400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/984050d9-edd5-4013-b256-b890462eeab3.png	400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/c01415ce-14ad-45a9-a625-adb463a6aaf3.png	400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/29b7527b-646d-4055-a95a-ec47914770ba.png	12321312312	21312	1		Agency 2	2024-04-13 10:44:57.434	400dfcd1-c606-4fe6-8a37-56cde11f5f30

INSERT INTO loan (amount, type, payment_duration, status, approved, signature_file_name, cin_cart_recto_file_name, cin_cart_verso_file_name, cin_number, tax_id, reception_method, bank_account_credentials_rib, selected_agency, loan_creation_date, client_id)
VALUES ( 2312313.0, 1, 0, 0, FALSE, '400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/984050d9-edd5-4013-b256-b890462eeab3.png', '400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/c01415ce-14ad-45a9-a625-adb463a6aaf3.png', '400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/29b7527b-646d-4055-a95a-ec47914770ba.png', 12321312312, 21312, 1, '', 'Agency 2', '2024-04-13 10:44:57.434', '400dfcd1-c606-4fe6-8a37-56cde11f5f30');


INSERT INTO loan (amount, type, payment_duration, status, approved, signature_file_name, cin_cart_recto_file_name, cin_cart_verso_file_name, cin_number, tax_id, reception_method, bank_account_credentials_rib, selected_agency, loan_creation_date, client_id)
VALUES ( 500000.0, 0, 1, 0, FALSE, '400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/984050d9-edd5-4013-b256-b890462eeab3.png', '400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/c01415ce-14ad-45a9-a625-adb463a6aaf3.png', '400dfcd1-c606-4fe6-8a37-56cde11f5f30/2024-04-13-10-44-57/29b7527b-646d-4055-a95a-ec47914770ba.png', 56456441654, 5555551, 1, '', 'Agency 3', '2024-04-13 10:44:57.434', '400dfcd1-c606-4fe6-8a37-56cde11f5f30');
