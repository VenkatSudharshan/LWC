import { LightningElement } from 'lwc';
import getAccountDetails from '@salesforce/apex/AccountDataController.getAccountDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class EntityForm extends NavigationMixin(LightningElement) {
    accountType = '';
    tickerSymbol = '';

    handleAccountChange() {
        const accountField = this.template.querySelector('[data-id="accountLookup"]');
        let accountId = accountField?.value;

        if (Array.isArray(accountId)) {
            accountId = accountId[0];
        }

        console.log('Account ID:', accountId);

        if (accountId) {
            getAccountDetails({ accountId })
                .then(result => {
                    this.accountType = result?.Type || '';
                    this.tickerSymbol = result?.TickerSymbol || '';
                })
                .catch(error => {
                    console.error('Error fetching account details:', error);
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Account_Type__c = this.accountType;
        fields.Ticker_Symbol__c = this.tickerSymbol;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const recordId = event.detail.id;

        // ✅ Toast
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Entity record created',
            variant: 'success'
        }));

        // ✅ Redirect to newly created record
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Entity__c',
                actionName: 'view'
            }
        });
    }

    handleCancel() {
        // ✅ Navigate back to object home list view
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Entity__c',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        });
    }

    handleError(event) {
        console.error('Form error:', event.detail);
    }
}
