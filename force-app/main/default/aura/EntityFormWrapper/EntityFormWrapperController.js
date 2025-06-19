({
    openModal : function(component, event, helper) {
        // Navigate to list view first
        var navService = component.find("navService");
        var pageReference = {
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Entity__c",
                actionName: "list"
            },
            state: {
                filterName: "Recent"
            }
        };

        // Navigate first, then open modal after a short delay
        navService.navigate(pageReference, true);

        // Wait for navigation to settle, then open modal
        setTimeout(function() {
            $A.createComponent("c:entityForm", {}, function(content, status) {
                if (status === "SUCCESS") {
                    component.find('overlayLib').showCustomModal({
                        header: "New Entity",
                        body: content,
                        showCloseButton: true,
                        cssClass: "slds-modal_medium"
                    });
                }
            });
        }, 200); // give it half a second to load
    }
})