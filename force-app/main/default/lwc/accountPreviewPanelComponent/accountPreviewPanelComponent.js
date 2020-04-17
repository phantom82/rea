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
        }else if(result.error) {
            this.showMsg('Error on data load',result.error.body.message,'error');
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
        return refreshApex(this._con);
    }

    //update the contact to be set as Primary for account
    handlePrimary(event) {
        if(this.con.Is_Primary__c == true) {
            this.showMsg('Information','Contact is already a Primary Contact.','warning');
        }else {
            setPrimaryContact({
                cId: this.recordId
            }).then((result) => {
                this.showMsg('Success','Record Is Updated','sucess');
                this.refreshData();
            }).catch((error) => {
                this.showMsg('Error on data save',error.body.message,'error');
            });
        }
    }

    showMsg(t, m, v) {
        return this.dispatchEvent(
            new ShowToastEvent({
                title: t,
                message: m,
                variant: v,
            }),
        ); 
    }

    //updates the account as per given input
    handleSave() {
        //imperative call to apex
        setAccount({
            aId: this.con.AccountId, 
            name: this.aname, 
            description: this.adescription
        }).then((result) => {
            this.showMsg('Success','Record Is Updated','sucess');
            this.refreshData();
            this.disabled = true;
        }).catch((error) => {
            this.disabled = false;
            this.showMsg('Error on data save',error.body.message,'error');
        });
    }

    handleCancel() {
        this.disabled = true;
    }
}