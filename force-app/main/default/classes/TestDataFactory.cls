@isTest
public class TestDataFactory {
    public static List<Account> createAccountsWithContacts(Integer totalAccounts, Integer contactsPerAccount) {
        List<Account> accounts = new List<Account>();
        List<Contact> contacts = new List<Contact>();
        for(Integer i = 0; i < totalAccounts; i++) {
            Account a = new Account(Name='TestAccount' + i);
            accounts.add(a);
        }
        insert accounts;

        for(Integer i = 0; i < totalAccounts; i++) {
            for (Integer j = 0; j < contactsPerAccount ; j++) {
                Contact c = new Contact(AccountId = accounts[i].Id, LastName = 'TestContact'+ j);
                contacts.add(c);
            }
        }
        insert contacts;

        return accounts;
    }

    public static List<Contact> getContact(Id aId) {
        return [Select Id, Name, AccountId, Is_Primary__c from Contact Where AccountId = :aId];
    }
}