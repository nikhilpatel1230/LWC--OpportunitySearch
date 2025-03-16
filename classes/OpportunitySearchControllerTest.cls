@isTest
public class OpportunitySearchControllerTest {
    
    @testSetup
    static void setupTestData() {
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        
        List<Opportunity> opps = new List<Opportunity>();
        for (Integer i = 0; i < 5; i++) {
            opps.add(new Opportunity(
                Name = 'Opportunity ' + i,
                CloseDate = Date.today().addDays(30),
                Amount = 1000 * (i+1),
                StageName = 'Prospecting',
                AccountId = acc.Id
            ));
        }
        insert opps;
    }
    
    @isTest
    static void testGetOpportunities_withSearchTerm() {
        Test.startTest();
        List<Opportunity> results = OpportunitySearchController.getOpportunities('Test');
        Test.stopTest();
        
        System.assertNotEquals(0, results.size(), 'Expected some opportunities to be returned');
    }
    
    @isTest
    static void testGetOpportunities_withoutSearchTerm() {
        Test.startTest();
        List<Opportunity> results = OpportunitySearchController.getOpportunities('');
        Test.stopTest();
        
        System.assertNotEquals(0, results.size(), 'Expected some opportunities to be returned when no search term is provided');
    }
    
    @isTest
    static void testLogCsvDownload() {
        List<String> selectedColumns = new List<String>{'Name', 'Amount', 'CloseDate'};
        Blob csvData = Blob.valueOf('Name,Amount,CloseDate\nTest Opp,1000,2025-01-01');
        
        Test.startTest();
        String logId = OpportunitySearchController.logCsvDownload('Test', selectedColumns, csvData);
        Test.stopTest();
        
        System.assertNotEquals(null, logId, 'Expected a valid log record ID to be returned');
        CSV_Download_Log__c logRecord = [SELECT Id, Search_Term__c FROM CSV_Download_Log__c WHERE Id = :logId LIMIT 1];
        System.assertEquals('Test', logRecord.Search_Term__c, 'Search term should match the one provided');
    }
}