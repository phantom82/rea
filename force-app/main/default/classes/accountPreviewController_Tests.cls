@isTest
private class accountPreviewController_Tests {
    @isTest static void accountPreviewController_Tests_Primary() {
        // Test data setup
        Account[] accts = TestDataFactory.createAccountsWithContacts(1, 1);
        Contact[] conts = TestDataFactory.getContact(accts[0].Id);
        // Perform test
        Test.startTest();
            accountPreviewController.setPrimaryContact(conts[0].Id);
            Contact c = accountPreviewController.getContact(conts[0].Id);
        Test.stopTest();
        System.assertEquals(c.Is_Primary__c,  true);
    }
    
    
    @isTest static void accountPreviewController_Tests_Contact() {
        // Test data setup
        Account[] accts = TestDataFactory.createAccountsWithContacts(1, 1);
        Contact[] conts = TestDataFactory.getContact(accts[0].Id);
        // Perform test
        Test.startTest();
            Contact c = accountPreviewController.getContact(conts[0].Id);
        Test.stopTest();
        System.assertEquals(c.AccountId,  accts[0].Id);
    }        

    
    @isTest static void accountPreviewController_Tests_Account() {
        // Test data setup
        Account[] accts = TestDataFactory.createAccountsWithContacts(1, 1);
        Contact[] conts = TestDataFactory.getContact(accts[0].Id);
        // Perform test
        Test.startTest();
            accountPreviewController.setAccount(accts[0].Id, 'Testing001', 'Some description on test');
        Test.stopTest();
        List<Account> a = [SELECT Id, Name, Description FROM Account WHERE Id = :accts[0].Id];
        System.assertEquals(a[0].Name,  'Testing001');
    }      
    
    @isTest static void accountPreviewController_Tests_Account_Negative() {
        // Test data setup
        Account[] accts = TestDataFactory.createAccountsWithContacts(1, 1);
        Contact[] conts = TestDataFactory.getContact(accts[0].Id);
        // Perform test
        Test.startTest();
        try {
            accountPreviewController.setAccount(accts[0].Id, null, 'Some description on test');
        }catch(exception e){}         
        Test.stopTest();
        System.assertNotEquals(accts[0].Name,  null);
    }      
}
