
import Table, { ColumnDescription } from 'react-bootstrap-table-next';
import './BaseTable.css'

interface currentSongInt {
    uri: string
    name: string
}

interface BaseTableProps {
    columnNames: ColumnDescription<any, any>[]
    data: any
    onDoubleClickHandler?: any
    currentSong?: currentSongInt
    currentIndex?:number
    setCurrentIndex?:any
}

const BaseTable = (props: BaseTableProps) => {

    const { data, columnNames, onDoubleClickHandler, currentSong, currentIndex, setCurrentIndex } = props;

    const tableReference = (n:any) => {
        const rowArray : [] = n?.table.props.data;
        rowArray?.forEach( (row:any, index:number) => {
            if(currentSong?.uri === row.uri || currentSong?.name === row.track){
                setCurrentIndex(index);
            } 
        } )
    }

    const rowEvents = {
        onDoubleClick: (e: any, row: any, index: any) => {
            setCurrentIndex(index);
            onDoubleClickHandler(e, row, index);
        },
    }

    const rowClasses : any = (row:any, rowIndex:any) => {
        if(rowIndex === currentIndex){
            return 'selected-row' 
        }
      };

    return (
        <Table
            ref={tableReference}
            bordered={false}
            hover
            classes='base-table'
            keyField='uri'
            data={data}
            columns={columnNames}
            rowEvents={rowEvents}
            rowClasses= {rowClasses} />
    );
}

export default BaseTable;