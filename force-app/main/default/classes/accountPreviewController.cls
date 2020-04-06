public with sharing class accountPreviewController {
    //
    @AuraEnabled (cacheable=true)
    public static Contact getContact(String cId){
        return [SELECT Is_Primary__c, AccountId, Account.Name, Account.Description, Account.CreatedDate FROM Contact WHERE Id = :cId][0];
    }

    //updates given account for the fields provided
    @AuraEnabled
    public static String setAccount(String aId, String name, String description){
        Account a = new Account(Id = aId);
        a.name = name;
        a.Description = description;
        try {
            update a;
        }catch(Exception e) {
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }

    //updates a contact as primary
    @AuraEnabled
    public static String setPrimaryContact(String cId){
        Contact c = new Contact(Id = cId);
        c.Is_Primary__c = true;
        try {
            update c;
        }catch(Exception e) {
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
}
