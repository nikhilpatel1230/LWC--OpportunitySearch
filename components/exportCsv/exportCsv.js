import { LightningElement, track, api } from 'lwc';
import logCsvDownload from '@salesforce/apex/OpportunitySearchController.logCsvDownload';

export default class ExportCsv extends LightningElement {
    @track isOpen = false;
    @track selectedColumns = [];
    @api records = [];

    columnOptions = [
        { label: 'Opportunity Name', value: 'Name' },
        { label: 'Description', value: 'Description' },
        { label: 'Close Date', value: 'CloseDate' },
        { label: 'Amount', value: 'Amount' },
        { label: 'Next Steps', value: 'NextStep' },
        { label: 'Account Name', value: 'AccountName' }
    ];

    get selectedColumnLabels() {
        return this.selectedColumns.map(col => {
            const column = this.columnOptions.find(option => option.value === col);
            return column ? column.label : col;
        });
    }

    @api openModal(records) {
        this.isOpen = true;
        this.records = JSON.parse(JSON.stringify(records)); 
    }

    closeModal() {
        this.isOpen = false;
    }

    handleColumnSelection(event) {
        this.selectedColumns = [...event.detail.value];
    }

    async downloadCsv() {
        if (!this.selectedColumns.length) {
            alert('Please select at least one column before downloading.');
            return;
        }
        const csvData = this.generateCsv();
        console.log(typeof csvData);
        if (!csvData) {
            alert('No data available to export.');
            return;
        }
        
        this.triggerDownload(csvData, 'opportunities.csv').then(() => {
            this.logDownload(csvData);
            this.closeModal();
        }).catch(error => {
            console.error('Error downloading CSV:', error);
        });
    }

    async triggerDownload(csvContent, fileName) {
        try {
            const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            const link = document.createElement('a');
            link.href = encodedUri;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error in file download:', error);
            throw error;
        }
    }

    generateCsv() {
        if (!this.records || this.records.length === 0) {
            return '';
        }
        
        const headers = this.selectedColumns.map(col => {
            const column = this.columnOptions.find(option => option.value === col);
            return column ? column.label : col;
        }).join(',');

        const rows = this.records.map(record =>
            this.selectedColumns.map(col => {
                let value = record[col];
                if (col === 'AccountName' && record.Account) {
                    value = record.Account.Name;
                }
                if (typeof value === 'string') {
                    value = `"${value.replace(/"/g, '""')}"`;
                } else if (value === null || value === undefined) {
                    value = '""';
                } else {
                    value = value.toString();
                }
                return value;
            }).join(',')
        ).join('\r\n');

        return `${headers}\r\n${rows}`;
    }

    async logDownload(csvData) {
        try {
            await logCsvDownload({ searchTerm: 'N/A', selectedColumns: this.selectedColumns, csvdata : csvData });
            console.log('CSV Download logged successfully in Salesforce');
        } catch (error) {
            console.error('Error logging CSV:', error);
        }
    }
}