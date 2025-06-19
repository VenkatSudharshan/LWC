public class AccountTriggerHandler {
    
    public static void beforeInsertLogic(List<Account> accountList){
        //Display new records
        System.debug(accountList);
        accountList[0].Phone='000-0000';
        System.debug(accountList);
    }
    
}