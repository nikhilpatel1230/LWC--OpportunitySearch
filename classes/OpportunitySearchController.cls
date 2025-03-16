public with sharing class OpportunitySearchController {
    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String searchTerm) {
        String searchPattern = '%' + searchTerm + '%';
        
        if (String.isEmpty(searchTerm) || searchTerm == null) {
            return [SELECT Id, Name, Description, CloseDate, Amount, NextStep, 
                    Account.Name FROM Opportunity ORDER BY CloseDate DESC LIMIT 100];
        }
        
        return [SELECT Id, Name, Description, CloseDate, Amount, NextStep, 
                Account.Name FROM Opportunity
                WHERE Account.Name LIKE :searchPattern];
    }
    
    @AuraEnabled
    public static String logCsvDownload(String searchTerm, List<String> selectedColumns, blob csvdata) {
        CSV_Download_Log__c log = new CSV_Download_Log__c(
            Search_Term__c = searchTerm,
            User__c = UserInfo.getUserId(),
            IP_Address__c = Auth.SessionManagement.getCurrentSession().get('SourceIp'),
            Selected_Columns__c = String.join(selectedColumns, ', ')
        );       
        insert log;
        
        contentVersion cVersion = new contentVersion();
        cVersion.Title = 'Test';
        cVersion.PathOnClient = 'test' +'.'+'csv'; 
        cVersion.versionData =csvdata;
        insert cVersion; 
        
        ID conDocument = [Select ContentDocumentID from ContentVersion 
                          where ID=:cVersion.ID].ContentDocumentID;
        
        ContentDocumentLink conDocLink = new ContentDocumentLink();
        conDocLink.LinkedEntityId = log.Id;
        conDocLink.ContentDocumentId = conDocument;
        conDocLink.shareType = 'V';
        conDocLink.Visibility = 'AllUsers';
        insert conDocLink;    
        return log.Id;
    }
}