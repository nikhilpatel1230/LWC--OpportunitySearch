**Overview** : <br/>This Lightning Web Component (LWC) enables users to search for Opportunities using custom filters and export the results as a CSV file. <br/> Additionally, i implemented a comprehensive pagination functionality for batter user experiance. <br/>Also i created one custom object to store the logs for auditing.

**Features** : <br/> Advanced Search: Filter opportunities by Account Name. <br/>Customizable Data Table: Displays key Opportunity fields. <br/>CSV Export with Column Selection: Users can choose columns before downloading.<br/> Audit Logging: Stores CSV file in Salesforce with user details, IP address, and search term as well as show with selected colmuns.

**Used Technologies** : <br/> LWC | Apex | SOQL | JavaScript | HTML

**Note** : <br/>  classes file : stored Apex controller code and Apex test code.<br/> component file : stored both the component ( child component : exportCsv, parent component : opportunitySearch ).<br/> <br/>**Custom Object & Fields** : CSV_Download_Log__c <br/>  **Fields** : <br/> Name : to store log name ( Auto Number ) <br/> IP_Address__c : to store the current user IP <br/> Search_Term__c : to store search term <br/> Selected_Columns__c : to store selected columuns  <br/> User__c : to store current user name
