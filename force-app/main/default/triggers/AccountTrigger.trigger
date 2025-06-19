trigger AccountTrigger on Account (before insert) {
    AccountTriggerHandler.beforeInsertLogic(Trigger.new);   
}