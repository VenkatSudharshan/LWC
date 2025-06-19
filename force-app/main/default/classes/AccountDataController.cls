public with sharing class AccountDataController {

    @AuraEnabled(cacheable=true)
    public static Account getAccountDetails(Id accountId) {
        if (accountId == null) return null;

        return [
            SELECT Id, Type, TickerSymbol
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getCasesForAccount(Id accountId) {
        if (accountId == null) return new List<Case>();

        return [
            SELECT Id, CaseNumber
            FROM Case
            WHERE AccountId = :accountId
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
public static Case getCaseDetails(Id caseId) {
    if (caseId == null) return null;

    return [
        SELECT Id, CaseNumber, Priority
        FROM Case
        WHERE Id = :caseId
        LIMIT 1
    ];
}
}