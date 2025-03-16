import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunitySearchController.getOpportunities';
const PAGE_SIZE = 10;
const columns = [  
        { label: 'Account Name', fieldName: 'AccountName' },
        { label: 'Opportunity Name', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Next Steps', fieldName: 'NextStep' },
];
export default class OpportunitySearch extends LightningElement {
    @track columns = columns;
    @track searchTerm = ''; 
    @track allRecords = [];
    @track displayedRecords = [];
    @track currentPage = 1;
    @track totalPages = 1;

    @wire(getOpportunities, { searchTerm: '$searchTerm' })
    wiredOpportunities({ error, data }) {
        if (data) {
            this.allRecords = data.map(opp => ({
                ...opp,
                AccountName: opp.Account ? opp.Account.Name : 'N/A' 
            }));
            this.currentPage = 1;
            this.updatePagination();
        } else if (error) {
            console.error('Error fetching opportunities:', error);
        }
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.allRecords.length / PAGE_SIZE) || 1;
        this.updatePageRecords();
    }

    updatePageRecords() {
        const start = (this.currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        this.displayedRecords = this.allRecords.slice(start, end);
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value.trim(); 
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePageRecords();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePageRecords();
        }
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }
    handleExport() {
        this.template.querySelector('c-export-csv').openModal(this.allRecords);
    }
}