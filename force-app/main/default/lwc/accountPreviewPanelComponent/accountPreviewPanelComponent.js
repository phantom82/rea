import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContact from '@salesforce/apex/accountPreviewController.getContact';
import setAccount from '@salesforce/apex/accountPreviewController.setAccount';
import setPrimaryContact from '@salesforce/apex/accountPreviewController.setPrimaryContact';
import { refreshApex } from '@salesforce/apex';

export default class AccountPreviewPanelComponent extends LightningElement {
    // native property for current contact record
    @api recordId;
    @track con;
    @track _con;
    @track disabled;
    // properties to track user input
    aname;
    adescription;
    /*
    createdDate cannot be modified for a record
    */

    //wired method to apex function
    //parameter is contact record Id
    //returns a contact record
    @wire(getContact, {cId: '$recordId'})
    wiredContact(result) {
        this._con = result;
        this.disabled = true;
        if(result.data) { 
            this.con = result.data; 
            this.aname = this.con.Account.Name;
            this.adescription = this.con.Account.Description;          
        } else if (result.error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error on data load',
                    message: result.error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    //method sets the properties for name and description
    handleUpdate(event) {
        if (event.target.label === 'Name') {
            this.aname = event.target.value;
        }
        if (event.target.label === 'Description') {
            this.adescription = event.target.value;
        }  
    }

    handleEdit() {
        this.disabled = false;
    }

    refreshData() {
        console.log('inside');
        return refreshApex(this._con);
    }

    //update the contact to be set as Primary for account
    handlePrimary(event) {
        if(this.con.Is_Primary__c == true) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Information',
                    message: 'Contact is already a Primary Contact.',
                    variant: 'warning',
                }),
            );
        }else {
            setPrimaryContact({
                cId: this.recordId
            }).then((result) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Is Updated',
                        variant: 'sucess',
                    }),
                );
                this.refreshData();
            }).catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error on data save',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
        }
    }

    //updates the account as per given input
    handleSave() {
        //imperative call to apex
        setAccount({
            aId: this.con.AccountId, 
            name: this.aname, 
            description: this.adescription
        }).then((result) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record Is Updated',
                    variant: 'sucess',
                }),
            ); 
            this.refreshData();
            this.disabled = true;
        }).catch((error) => {
            this.disabled = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error on data save',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });
    }

    handleCancel() {
        this.disabled = true;
    }
}