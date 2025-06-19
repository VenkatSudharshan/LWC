public with sharing class CustomLookupController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCasesByAccount(Id accountId, String searchKey) {
        if (String.isEmpty(searchKey) || accountId == null) return new List<Case>();

        return [
            SELECT Id, CaseNumber
            FROM Case
            WHERE AccountId = :accountId AND CaseNumber LIKE :('%' + searchKey + '%')
            LIMIT 10
        ];
    }
}