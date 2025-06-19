import { LightningElement } from 'lwc';
import getAccountDetails from '@salesforce/apex/AccountDataController.getAccountDetails';
import getCaseDetails from '@salesforce/apex/AccountDataController.getCaseDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class EntityForm extends NavigationMixin(LightningElement) {
    accountType = '';
    tickerSymbol = '';
    casePriority = '';

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

    handleCaseChange() {
        const caseField = this.template.querySelector('[data-id="caseLookup"]');
        let caseId = caseField?.value;

        if (Array.isArray(caseId)) {
            caseId = caseId[0];
        }

        console.log('Case ID:', caseId);

        if (caseId) {
            getCaseDetails({ caseId })
                .then(result => {
                    this.casePriority = result?.Priority || '';
                })
                .catch(error => {
                    console.error('Error fetching case details:', error);
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Account_Type__c = this.accountType;
        fields.Ticker_Symbol__c = this.tickerSymbol;
        fields.Case_Priority__c = this.casePriority;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const recordId = event.detail.id;

        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Entity record created',
            variant: 'success'
        }));

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