import { DatagridColumnType } from '@/shared/models/components/datagrid-column';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    public async exportExcel(data: any[], fileName: string): Promise<void> {
        const xlsx = await import('xlsx');
        const worksheet = xlsx.utils.json_to_sheet(data);

        const objectMaxLength: number[] = [];

        data.forEach((row) => {
            Object.keys(row).forEach((key, i) => {
                const cellValue = row[key] ? String(row[key]) : '';
                objectMaxLength[i] = Math.max(objectMaxLength[i] || 10, cellValue.length);
            });
        });

        worksheet['!cols'] = objectMaxLength.map((width) => ({ wch: width + 2 }));

        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

        this.saveAsExcelFile(excelBuffer, fileName);
    }

    public async exportPdf(columns: DatagridColumnType[], data: any[], filename: string): Promise<void> {
        const jsPDFModule = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;
        const PDF_EXTENSION = '.pdf';

        const doc = new jsPDFModule.jsPDF('l', 'pt', 'a4');
        const headers = columns.map(col => col.header);

        doc.setFontSize(14);
        doc.text(filename, 40, 40);

        const body = data.map(row =>
            columns.map(col => {
                const value = row[col.field];
                return value instanceof Date
                    ? value.toLocaleDateString('pt-BR')
                    : value ?? '';
            })
        );

        autoTable(doc, {
            head: [headers],
            body,
            startY: 60,
            styles: {
                fontSize: 9,
                cellPadding: 5,
                halign: 'left',
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });

        doc.save(`${filename}_export_${new Date().getTime()}${PDF_EXTENSION}`);
    }

    private saveAsExcelFile(buffer: ArrayBuffer, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';

        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
    }

}
