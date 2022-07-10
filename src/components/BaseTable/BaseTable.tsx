import  Table, { ColumnDescription }  from 'react-bootstrap-table-next';

interface BaseTableProps {
    columnNames: ColumnDescription<any, any>[]
    data: any
    onDoubleClickHandler?: any
}

const BaseTable = (props:BaseTableProps) => {
    
    const { data, columnNames, onDoubleClickHandler } = props;

    const rowEvents = {
        onDoubleClick: (e:any, row:any, index:any) => {
            onDoubleClickHandler(e, row, index);
        }
    }

    return (
        <Table keyField='uri' data={data} columns={columnNames} rowEvents={rowEvents} />
    );
}

export default BaseTable;